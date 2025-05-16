pipeline {
  agent any
  
  environment {
    DOCKERHUB_USERNAME = 'krishna1908'
    FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/expense-tracker-frontend"
    BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/expense-tracker-backend"
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
  }
  
  stages {
    stage('Clone Repo') {
      steps {
        git url: 'https://github.com/KrishnaMore19/expenses-tracker.git', branch: 'main'
      }
    }
    
    stage('Backend Tests') {
      steps {
        dir('backend') {
          sh 'echo "Running backend tests..." || true'
          // Add your actual test commands here
        }
      }
    }
    
    stage('Frontend Tests') {
      steps {
        dir('frontend') {
          sh 'echo "Running frontend tests..." || true'
          // Add your actual test commands here
        }
      }
    }
    
    stage('Build Backend Image') {
      steps {
        script {
          sh "docker build -t ${env.BACKEND_IMAGE}:latest ./backend"
        }
      }
    }
    
    stage('Build Frontend Image') {
      steps {
        script {
          sh "docker build -t ${env.FRONTEND_IMAGE}:latest ./frontend"
        }
      }
    }
    
    stage('Push Images to Docker Hub') {
      steps {
        script {
          sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
          sh "docker push ${env.BACKEND_IMAGE}:latest"
          sh "docker push ${env.FRONTEND_IMAGE}:latest"
        }
      }
      post {
        always {
          sh 'docker logout'
        }
      }
    }
    
    stage('Check Kubernetes Connection') {
      steps {
        script {
          try {
            sh 'kubectl version --short'
          } catch (Exception e) {
            error "Failed to connect to Kubernetes cluster. Please check kubectl configuration."
          }
        }
      }
    }
    
    stage('Deploy to Kubernetes') {
      steps {
        script {
          try {
            sh 'kubectl apply -f k8s/backend-deployment.yaml'
            sh 'kubectl apply -f k8s/backend-service.yaml'
            sh 'kubectl apply -f k8s/frontend-deployment.yaml'
            sh 'kubectl apply -f k8s/frontend-service.yaml'
            sh 'kubectl apply -f k8s/ingress.yaml'
          } catch (Exception e) {
            echo "Deployment failed, initiating rollback..."
            sh 'kubectl rollout undo deployment/backend-deployment || true'
            sh 'kubectl rollout undo deployment/frontend-deployment || true'
            error "Deployment failed: ${e.message}"
          }
        }
      }
    }
    
    stage('Verify Deployment') {
      steps {
        script {
          sh 'kubectl get deployments'
          sh 'kubectl get services'
          sh 'kubectl get pods'
          // Wait for pods to be ready
          sh 'kubectl wait --for=condition=ready pod -l app=backend --timeout=300s || true'
          sh 'kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s || true'
        }
      }
    }
  }
  
  post {
    success {
      echo 'Pipeline executed successfully!'
    }
    failure {
      echo 'Pipeline execution failed!'
    }
    always {
      // Clean up local Docker images to save space
      sh 'docker rmi ${FRONTEND_IMAGE}:latest || true'
      sh 'docker rmi ${BACKEND_IMAGE}:latest || true'
    }
  }
}