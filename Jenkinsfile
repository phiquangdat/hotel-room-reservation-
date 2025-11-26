pipeline {
    agent any

    environment {
        BACKEND_PORT = "9090"
        LOCAL_DB_HOST = "localhost"
        LOCAL_DB_NAME = "hotel_reservation_db"
        LOCAL_DB_PORT = "5432"
        JWT_EXPIRATION = "86400000"
    }

    stages {
        stage('Load Environment Variables') {
            steps {
                withCredentials([
                    string(credentialsId: 'jenkins-local-db-user', variable: 'LOCAL_DB_USER'),
                    string(credentialsId: 'jenkins-local-db-password', variable: 'LOCAL_DB_PASSWORD'),
                    string(credentialsId: 'jenkins-jwt-secret', variable: 'JWT_SECRET')
                ]) {
                    sh '''
cat > .env <<EOF
LOCAL_DB_HOST=${LOCAL_DB_HOST}
LOCAL_DB_PORT=${LOCAL_DB_PORT}
LOCAL_DB_USER=${LOCAL_DB_USER}
LOCAL_DB_PASSWORD=${LOCAL_DB_PASSWORD}
LOCAL_DB_NAME=${LOCAL_DB_NAME}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=${JWT_EXPIRATION}
EOF
'''
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo 'Building backend for test...'
                sh 'docker compose build backend'  
            }
        }


        stage('Test Frontend') {
            steps {
                echo 'Building frontend for test...'
                sh 'docker compose build frontend'
                sh 'docker compose run --rm frontend npm test --passWithNoTests'
            }
        }


        stage('Deploy') {
            steps {
                echo 'Deploying backend and frontend...'
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
