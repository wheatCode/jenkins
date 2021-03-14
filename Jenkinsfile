pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
            steps {
                sh 'ls'
                sh 'npm run test'
            }
        }
    }
}
