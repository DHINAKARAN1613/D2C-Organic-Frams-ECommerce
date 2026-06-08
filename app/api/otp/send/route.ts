import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { type } = body; // "EMAIL" or "PHONE"

        if (type !== 'EMAIL' && type !== 'PHONE') {
            return new NextResponse('Invalid OTP type', { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const identifier = type === 'EMAIL' ? user.email : user.phone;
        if (!identifier) {
            return new NextResponse(`No ${type.toLowerCase()} found on profile`, { status: 400 });
        }

        // Generate a 6 digit secure random code
        const code = crypto.randomInt(100000, 999999).toString();

        // Expire in 10 minutes
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        // Save to DB
        await prisma.oTP.create({
            data: {
                userId: user.id,
                code,
                type,
                expiresAt,
            }
        });

        // DISPATCH OTP
        if (type === 'EMAIL') {
            try {
                const nodemailer = require('nodemailer');
                let transporter;

                if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
                    // Production / Real Gmail setup
                    transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_APP_PASSWORD
                        }
                    });
                } else {
                    // Development Mock Setup (Ethereal Email)
                    console.log('Generating Ethereal test email account...');
                    const testAccount = await nodemailer.createTestAccount();
                    transporter = nodemailer.createTransport({
                        host: "smtp.ethereal.email",
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: testAccount.user, // generated ethereal user
                            pass: testAccount.pass, // generated ethereal password
                        },
                    });
                }

                const mailOptions = {
                    from: `"Yogam Organic Farms" <${process.env.EMAIL_USER || 'test@ethereal.email'}>`,
                    to: identifier,
                    subject: 'Your Verification Code',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color: #30e87a; text-align: center;">Yogam Organic Farms</h2>
                            <p style="font-size: 16px; color: #333;">Hello,</p>
                            <p style="font-size: 16px; color: #333;">Your verification code is:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #112117; background-color: #f4f4f4; padding: 10px 20px; border-radius: 8px;">${code}</span>
                            </div>
                            <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
                            <p style="font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
                        </div>
                    `
                };

                const info = await transporter.sendMail(mailOptions);
                console.log(`\n=========================================`);
                console.log(`[EMAIL DISPATCH] OTP sent to ${identifier}`);
                
                if (!process.env.EMAIL_USER) {
                    // Log the ethereal url so the user can see the email visually!
                    console.log(`[TEST EMAIL URL]: ${nodemailer.getTestMessageUrl(info)}`);
                    console.log(`Your Yogam Organic Farms verification code is: ${code}`);
                }
                console.log(`=========================================\n`);

            } catch (err) {
                console.error('Failed to send email:', err);
                return new NextResponse('Failed to send email. Check SMTP settings.', { status: 500 });
            }
        } else {
            // Simulated SMS dispatch
            console.log(`\n=========================================`);
            console.log(`[SIMULATED SMS DISPATCH]`);
            console.log(`To: ${identifier}`);
            console.log(`Your Yogam Organic Farms verification code is: ${code}`);
            console.log(`=========================================\n`);
        }

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        console.error('[OTP_SEND_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
