pipeline {
    agent any

    environment {
        LOCAL_DB_USER     = "${env.LOCAL_DB_USER}"
        LOCAL_DB_PASSWORD = "${env.LOCAL_DB_PASSWORD}"
        LOCAL_DB_NAME     = "${env.LOCAL_DB_NAME}"
        LOCAL_DB_PORT     = "5432"
        JWT_SECRET        = "${env.JWT_SECRET}"
        JWT_EXPIRATION    = "${env.JWT_EXPIRATION}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from Git...'
                checkout scm
            }
        }

        stage('Load Environment Variables') {
            steps {
                sh '''
                cat > .env <<EOF
                    LOCAL_DB_USER=${LOCAL_DB_USER}
                    LOCAL_DB_PASSWORD=${LOCAL_DB_PASSWORD}
                    LOCAL_DB_NAME=${LOCAL_DB_NAME}
                    LOCAL_DB_PORT=${LOCAL_DB_PORT}
                    JWT_SECRET=${JWT_SECRET}
                    JWT_EXPIRATION=${JWT_EXPIRATION}
                    EOF
                '''
            }
        }

        stage('Test Backend') {
            steps {
                echo 'Building backend for test...'
                sh 'docker compose --progress plain build backend'

                echo 'Running Spring Boot unit tests...'
                sh 'docker compose run --rm backend ./mvnw test -B'
            }
        }

        stage('Test Frontend') {
            steps {
                echo 'Building frontend for test...'
                sh 'docker compose --progress plain build frontend'

                echo 'Running Next.js unit tests...'
                sh 'docker compose run --rm frontend npm test -- --ci --passWithNoTests'
            }
        }

        stage('Deploy') {
            steps {
                echo 'All tests passed! Deploying application...'
                sh 'docker compose up -d --build --progress plain'
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
