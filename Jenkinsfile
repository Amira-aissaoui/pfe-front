def server = Artifactory.server 'Artifactory'

pipeline {
    agent any
    
    environment {
        API_URL = 'http://localhost:8080/'  
    }
    
    tools {
        nodejs 'NodeJs' 
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'front', url: 'https://172.18.3.186/PFE-DEVOPS-2024/Plateforme_de_Monitoring_des_infrastructures_DevOps.git'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build -- --configuration=production'
            }
        }
   
        
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**'
            }
        }

        stage('Publish to JFrog Artifactory') {
            steps {
                script {
                    def uploadSpec = """{
                        "files": [
                            {
                                "pattern": "dist/**",
                                "target": "pfeaes-Jenkins-integration/"
                            }
                        ]
                    }"""
                    server.upload(uploadSpec)
                }
            }
        }
    


        
    }
}
