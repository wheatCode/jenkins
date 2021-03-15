pipeline {
    agent none
    stages {
        stage('Test') {
          agent {
                dockerfile {
                    filename 'Dockerfile'
                }
            }
            steps {
                sh 'node -v'
                sh 'npm install -g npm@latest'
                sh 'npm install'
                sh 'node node_modules/puppeteer/install.js'
                sh 'ls'
                sh 'npm run test'
            }
        }
    }
}
