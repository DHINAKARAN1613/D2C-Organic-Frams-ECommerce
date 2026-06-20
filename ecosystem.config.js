module.exports = {
  apps: [
    {
      name: "yogam-organic-farms",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max", // Runs as many instances as there are CPU cores
      exec_mode: "cluster", // Enables PM2's built-in load balancer
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
