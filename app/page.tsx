'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mail, ChevronRight, Leaf } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // Apple-like ease
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <main className="flex-grow w-full">
      {/* Hero Section */}
      <section ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Background Image - Local File */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Organic Hero Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          {/* Minimal Overlay */}
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          {/* Subtle Color Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-orange-500/10 mix-blend-overlay z-10"></div>
        </div>

        {/* Content */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          style={{ opacity: opacityHero }}
          className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center gap-8 px-4 pt-20"
        >
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            className="group cursor-pointer inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-bold uppercase tracking-widest backdrop-blur-md shadow-lg transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(48,232,122,0.3)]"
          >
            <Leaf className="w-5 h-5 fill-current text-primary group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
            <span className="text-white group-hover:text-primary transition-colors duration-300">100% Organic & Fresh</span>
          </motion.div>

          <motion.h1
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-6xl md:text-7xl lg:text-9xl font-display font-bold leading-none tracking-tighter drop-shadow-2xl flex flex-col items-center"
          >
            <motion.span
              variants={fadeInUp}
              className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/70 drop-shadow-sm z-10 pb-6"
            >
              Pure Organic
              {/* Glow effect behind text */}
              <motion.span
                className="absolute inset-0 blur-2xl opacity-25 bg-white -z-10 h-full w-full block"
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.span>
            <motion.span
              variants={fadeInUp}
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-gradient-x bg-[length:200%_auto] pb-4 cursor-default drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
            >
              Essential
              {/* Glow effect behind text */}
              <motion.span
                className="absolute inset-0 blur-3xl opacity-30 bg-yellow-500 -z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-gray-200 max-w-2xl font-light leading-relaxed drop-shadow-md">
            Curated natural goods for a sustainable lifestyle. Reconnect with nature through our hand-picked selection of earth-friendly products.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 mt-6 w-full sm:w-auto">
            <Link href="/shop" className="group h-14 px-10 rounded-full bg-[#30e87a] text-black text-lg font-bold tracking-wide transition-all duration-300 relative overflow-hidden hover:scale-105 shadow-[0_0_20px_rgba(48,232,122,0.5)] hover:shadow-[0_0_40px_rgba(48,232,122,0.8),0_0_80px_rgba(48,232,122,0.4)] flex items-center justify-center gap-2 border border-[#30e87a]">
              <span className="relative z-10 flex items-center gap-2">
                Shop Natural
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
            </Link>
            <Link href="/about" className="h-14 px-10 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white text-lg font-medium transition-all hover:scale-105 hover:border-primary/50 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] flex items-center justify-center">
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4 md:px-8 max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Featured Categories</h2>
            <p className="text-muted-foreground text-base">Explore our most popular collections</p>
          </div>
          <Link href="/shop" className="text-primary font-medium hover:text-foreground transition-colors flex items-center gap-1 group">
            View All Categories
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -10 }}
            className="group relative flex flex-col gap-4"
          >
            <div className="relative aspect-[4/5] md:aspect-square w-full overflow-hidden rounded-2xl bg-surface shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfV3OtUbz2LDIQPo9SIMbXkV2uDH36HsdhnIF72UJ6Y17VvaX6hfQUU7tQaNR_O-jCyH_nR-dZiDxVDN8l54GNrK7CvGsDwJcVe5oHTMEZ9KRBoVNEAu5rgqHhKCMKurEd7KWpaO7ep0UDkNwHDb5NXm8ETrr-AVLh9-J-QnaXtVpkhJfltiMNoiDUtXaiVA33wYniz_a00KIIccmJ8805Y8Hv2oKLhsCw290iMLdE-jFLc0VF9E438saIrxE1cj1scbnNAe-G0xA')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-foreground mb-1">Handcrafted Soaps</h3>
                <p className="text-muted-foreground text-sm mb-4 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">Gentle on skin, tough on impurities.</p>
                <Link href="/shop?category=Soaps" className="w-full h-10 bg-white/10 backdrop-blur-md rounded-lg text-foreground text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                  View Collection
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -10 }}
            className="group relative flex flex-col gap-4"
          >
            <div className="relative aspect-[4/5] md:aspect-square w-full overflow-hidden rounded-2xl bg-surface shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBV7IlLX3hMAMmpLBProjSGfIXTB-1PdR73zf1RDPRyXG18HbFoshdhEn9LTbeXpCh1p3K4SKdOg7Tqn5Sv2c0KH-cGCNikqqCbqI6JbgEObyfN3zdU_qndZc3ZKdlyLP5TcvC0ApnY6YYPOfmaZmPRtEya9F5y41aqdPThuJlcIfMfF3phWnZNISuGsvhmjXflWySk3OfV6biZW8WCcAR8nCwzR7a_zUh7Y7vEz2fl-RaVJBkKWpv7ra3y_xo8UI123-zArFQwH2E')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-foreground mb-1">Daily Essentials</h3>
                <p className="text-muted-foreground text-sm mb-4 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">Sustainable living made simple.</p>
                <Link href="/shop?category=Essentials" className="w-full h-10 bg-white/10 backdrop-blur-md rounded-lg text-foreground text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                  View Collection
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -10 }}
            className="group relative flex flex-col gap-4"
          >
            <div className="relative aspect-[4/5] md:aspect-square w-full overflow-hidden rounded-2xl bg-surface shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzXGpsSJ9wQjq3vUMOYs0Kxf8KZC9lXE_kyQDXmcb2QAWgFevZp97sHziygxnWQLa3_w6_-DLaHFa1iomubnF4w7hKuiJWq3ZyDM-hwRow8SoY3KCfaHDPl08YkUmQ0jWgWYzrVWmUtUA8D8cszGNvl8e64LLH_LXhJmImRyaad5j5BzseHikv_-RHGlEitVvg9ykhaTEfFse9qu8Hf87WNSwT5X0yMMlJtCmGBrUPGKeG_HuxgXHJ1RRGKsvV7qG4y-O5OuYw3aU')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-foreground mb-1">Organic Groceries</h3>
                <p className="text-muted-foreground text-sm mb-4 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">Fresh produce from local farms.</p>
                <Link href="/shop" className="w-full h-10 bg-white/10 backdrop-blur-md rounded-lg text-foreground text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                  View Collection
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Farmer Selling Highlight */}
      <section className="py-16 px-4 md:px-8 max-w-[1280px] mx-auto">
        <div className="bg-gradient-to-r from-[#112117] to-[#1c2e24] rounded-3xl p-8 md:p-12 border border-[#2d4035] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#30e87a]/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Are you a local farmer?</h2>
            <p className="text-[#9db8a8] text-lg mb-6 max-w-xl">
              Join our marketplace and sell your organic produce directly to conscious consumers. Enjoy fair prices, simple inventory management, and a growing community.
            </p>
            <Link href="/auth/signup?role=farmer" className="inline-flex items-center gap-2 bg-[#30e87a] text-[#112117] font-bold px-8 py-4 rounded-full hover:bg-[#25c465] transition-all hover:scale-105 shadow-[0_0_20px_rgba(48,232,122,0.3)]">
              <Leaf className="w-5 h-5" /> Start Selling Today
            </Link>
          </div>
          <div className="w-full md:w-1/3 relative z-10 flex justify-center">
            <div className="size-48 rounded-full bg-[#1c2e24] border-4 border-[#2d4035] shadow-inner flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[#30e87a]/5 rounded-full animate-pulse"></div>
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer&style=circle" alt="Farmer Avatar" className="w-full h-full object-cover scale-125" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-surface border-y border-border">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="size-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">Join our Green Journey</h2>
          <p className="text-muted-foreground mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              className="flex-1 bg-surface border border-border rounded-full px-6 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              placeholder="Enter your email address"
              type="email"
            />
            <button className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:bg-[#25c465] transition-colors whitespace-nowrap" type="button">
              Sign Up
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </motion.div>
      </section>
    </main>
  );
}
