module.exports = {
  apps: [
    {
      name: "online-clipboard",
      script: "npm",
      args: "start",
      cwd: "./online_clipboard",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
