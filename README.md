# Inbox Guardian

## Overview:

**Inbox Guardian** is an AI powered email threat scanner made in a small package for your browser. By installing it as an extension, you can get real time analysis on your currently open email on popular email sites such as gmail and outlook. Inbox Guardian is powered by Tensorflow and runs entirely on your machine to ensure privacy. No information ever leaves your computer\! Our tool will let users from everyday browsers to tech specialists have a second opinion on security when viewing their inbox.

### Tools Used

- Programming Languages  
  - Python  
  - Javascript  
  - CSS  
- Tensorflow  
  - [tensorflow.js](http://tensorflow.js)  
  - TensorFlow Serving  
- Public Datasets  
  - https://huggingface.co/AcuteShrewdSecurity/Llama-Phishsense-1B  
  - https://www.kaggle.com/datasets/naserabdullahalam/phishing-email-dataset  
  - https://www.kaggle.com/datasets/ethancratchley/email-phishing-dataset/data

### Design Decisions 

- [x] ~~Gen AI or Machine Learning~~  
- Machine Learning  
- [x] What machine Learning model  
- [x] Dataset
- [x] Chrome Extension  
- [ ] Firefox Compatibility

### Diagrams

![Inbox-Guardian-Architecture-Draft](https://github.com/user-attachments/assets/672527a1-c405-40de-83a9-75e9afd995d0)


### Milestones

#### Progress Checklist

- [x] ~~Repo Created~~  
- [x] ~~Extension Framework~~  
- [x] DOM Scraping Functional  
- [x] Model Trained  
- [x] Model implementation

#### Required Deliverable

- [x] Unpacked Extension Functional

#### Extended Milestones

- [ ] Improve model accuracy
- [ ] More informative UI  
- [ ] Text evaluation summary  
- [ ] Functional on different mail sites  
- [ ] Published on Chrome & Firefox Store

### Concerns

- Ensure Model is same format as what is readable for extension  
- Ensure Dataset is recent  
- Classification model might not lead to score  
- Run only on local machine for privacy
