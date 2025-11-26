pipeline {
    agent any
    environment {
        BACKEND_PORT = "9090"
    }

    stages {
        stage('Load Environment Variables') {
steps {
sh '''#!/bin/bash
cat > .env <<EOF
LOCAL_DB_USER=$LOCAL_DB_USER
LOCAL_DB_PASSWORD=$LOCAL_DB_PASSWORD
LOCAL_DB_NAME=$LOCAL_DB_NAME
LOCAL_DB_PORT=$LOCAL_DB_PORT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=$JWT_EXPIRATION
EOF
'''
}
}

        stage('Test Backend') {
            steps {
                echo 'Building backend for test...'
                sh 'docker compose --progress plain build backend'

                echo 'Running Spring Boot unit tests...'
                sh 'docker compose run --rm backend mvn test'
            }
        }

        stage('Test Frontend') {
            steps {
                echo 'Building frontend for test...'
                sh 'docker compose --progress plain build frontend'

                echo 'Running Next.js unit tests...'
                sh 'docker compose run --rm frontend npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'All tests passed! Deploying application...'
                sh 'docker compose up -d --build'
            }
        }

    }

    post {
        always {
            echo 'Cleaning up old Docker images...'
            sh 'docker image prune -f || true'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
