# What is NONA?

apparel retail market size is 368 billion in US in 2019. In 2018, retail e-commerce revenues from apparel and accessories sales amounted to 110 billion U.S. dollarshttps://www.statista.com/statistics/995215/apparel-and-footwear-market-size-by-selected-market/ https://www.statista.com/statistics/278890/us-apparel-and-accessories-retail-e-commerce-revenue/

# Development setup steps:
- `cd Hackathon/flask`
- `python3 -m venv venv`
(on windows, you should run .venv\Scripts\activate.bat)
- `virtualenv venv`
- `source venv/bin/activate` (you should see something like `(venv) delong@...`)
- `pip3 install -r requirements.txt`
- `flask run`

# Local Deployment
- `docker build --tag=leelightman/nona .\Hackathon\flask\`
- `docker run -p 8080 leelightman/nona`

# First Time Deployment:
- `gcloud config set project nona-270513`
- `gcloud config set compute/zone us-east4`
- `export PROJECT_ID=nona-270513`
- `gcloud auth configure-docker`
- `docker build -t gcr.io/nona-270513/nona .\Hackathon\flask\`
- `docker push gcr.io/nona-270513/nona`
- `gcloud container clusters create nona-cluster --num-nodes=1`
- `kubectl create deployment nona-web --image=gcr.io/nona-270513/nona`
- `kubectl get pods`
- `kubectl expose deployment nona-web --type=LoadBalancer --port 80 --target-port 8080`
- `kubectl get service`

# Deployment:
- `docker build -t gcr.io/nona-270513/nona .\Hackathon\flask\`
- `docker push gcr.io/nona-270513/nona`

# More resources for Flask
- https://awesomeopensource.com/projects/flask