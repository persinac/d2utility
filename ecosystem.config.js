module.exports = {
  apps : [
      {
        name: 'API',
        script: 'server\\server.js',
        instances: 1,
        autorestart: true,
        watch: true,
        ignore_watch : ["node_modules", "client/img"],
        env: {
          NODE_ENV: 'development'
        }
      },
    {
      // this is specific to a windows start
      // for *nix the script can just be 'npm'
      name: 'Bot',
      script: 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
      args: 'run -- win-start',
      instances: 1,
      autorestart: false,
      watch: true,
      ignore_watch : ["node_modules", "client/img"],
      env: {
        NODE_ENV: 'development'
      }
    }
  ],

  // deploy : {
  //   production : {
  //     user : 'node',
  //     host : '212.83.163.1',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
