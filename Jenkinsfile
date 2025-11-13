pipeline {
    // This pipeline can run on any available Jenkins agent (node)
    agent any 
    
    stages {
        // Stage 1: Get the code from your Git repository
        stage('Checkout') {
            steps {
                echo 'Checking out code from Git...'
                // 'checkout scm' is a built-in Jenkins step
                // to pull the code from the repo this pipeline is linked to.
                checkout scm
            }
        }
        
        // Stage 2: Run backend unit tests
        stage('Test Backend') {
            steps {
                echo 'Running Spring Boot unit tests...'
                // This command does the following:
                // 1. 'docker compose run': Starts a one-off container.
                // 2. '--build': Builds the 'backend' image from its Dockerfile if it's new.
                // 3. '--rm': Automatically removes the container after the test.
                // 4. 'backend': The name of the service from docker-compose.yml to run.
                // 5. 'mvn test': The command to execute *inside* that container.
                // This will also start the 'db' service because 'backend' depends_on it.
                sh 'docker compose run --build --rm backend mvn test'
            }
        }
        
        // Stage 3: Run frontend unit tests
        stage('Test Frontend') {
            steps {
                echo 'Running Next.js unit tests...'
                // This does the same as the backend test, but for the frontend.
                // It runs 'npm test' inside a fresh 'frontend' container.
                sh 'docker compose run --build --rm frontend npm test'
            }
        }
        
        // Stage 4: Deploy the application (if all tests passed)
        stage('Deploy') {
            steps {
                echo 'All tests passed! Building and deploying application...'
                // This is the command to bring up your full application.
                // 1. 'docker compose up': Starts all services.
                // 2. '-d': Runs them in detached (background) mode.
                // 3. '--build': Builds new images for any services that have changed.
                sh 'docker compose up -d --build'
            }
        }
    }
    
    // 'post' runs after all stages are complete
    post {
        always {
            // This runs whether the build succeeded or failed
            echo 'Pipeline finished. Cleaning up old images...'
            // 'docker image prune -f' is good housekeeping.
            // It removes any old, dangling Docker images to save disk space.
            sh 'docker image prune -f'
        }
    }
}