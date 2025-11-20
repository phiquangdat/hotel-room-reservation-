pipeline {
    // This pipeline can run on any available Jenkins agent (node)
    agent any 
    
    stages {
        // Stage 1: Get the code from your Git repository
        stage('Checkout') {
            steps {
                echo 'Checking out code from Git...'
                checkout scm
            }
        }
        
        // Stage 2: Load environment variables
        stage('Load Environment Variables') {
            steps {
                script {
                    // Use .env.jenkins if exists (recommended for CI)
                    if (fileExists('.env')) {
                        sh 'cp .env .env'
                    }
                    } else {
                        echo 'Warning: No .env or .env.jenkins found. Using defaults (may fail)'
                    }
                }
        }


        // Stage 3: Run backend unit tests
        stage('Test Backend') {
            steps {
                echo 'Building backend for test...'
                // (FIX) Build the image first
                sh 'docker compose build backend'
                
                echo 'Running Spring Boot unit tests...'
                // (FIX) Run the test on the built image
                sh 'docker compose run --rm backend ./mvnw test -B'
            }
        }
        
        // Stage 3: Run frontend unit tests
        stage('Test Frontend') {
            steps {
                echo 'Building frontend for test...'
                // (FIX) Build the image first
                sh 'docker compose build frontend'

                echo 'Running Next.js unit tests...'
                // (FIX) Run the test on the built image
                sh 'docker compose run --rm frontend npm test -- --ci --passWithNoTests'
            }
        }
        
        // Stage 4: Deploy the application (if all tests passed)
        stage('Deploy') {
            steps {
                echo 'All tests passed! Building and deploying application...'
                // This command is correct
                sh 'docker compose up -d --build'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finished. Cleaning up old images...'
            // This command will now work because Jenkins has permission
            sh 'docker image prune -f'
        }
    }
}