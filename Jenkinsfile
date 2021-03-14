pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
            steps {
                sh 'node -v'
                sh 'npm install -g npm@latest'
                sh 'npm install'
                sh 'node node_modules/puppeteer/install.js'
                sh 'mkdir pdf'
                sh 'mkdir img'
                sh 'ls'
                sh 'npm run test'
            }
        }
    }
}
