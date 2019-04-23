module.exports = {
  apps : [{
    name: 'detectiveBackend',
    script: 'app.js',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },

  }],

  deploy : {
    production : {
      user : 'node',
      host : '149.129.52.68',
      ref  : 'origin/master',
      repo : 'git@github.com:haven2world/detectiveGameApp.git',
      path : '/home/admin/detective/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
