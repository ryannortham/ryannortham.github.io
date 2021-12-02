---
layout: post
title: "Automate Azure Service Principles and Terraform Cloud Using Fish Shell"
date: 2021-11-30 16:00:00 +1100
categories: Blogging Tutorial
tags: azure terraform fish
comments: true

image:
  src: ./../../assets/img/banners/terraform-azure-760x280.png
  width: 760    # in pixels
  height: 280   # in pixels
  alt: Terraform + Microsoft Azure
---

## Introduction

In this tutorial i'll show you how to create an Azure Service Principle using Azure CLI, and automatically upload the service principle details to Terraform Cloud. This approach minimises 'click-ops' and sets us up to use Terraform cloud to deploy our Azure infrastructure (which i'll cover in my next blog post).

## Initial Tasks

### Install Command-line Tools

#### [Fish Shell](https://fishshell.com/)
My shell of choice for this tutorial. It has great features like syntax highlighting and auto completion working out of the box. Its syntax is a little different from bash, but this shouldn't be a huge leap if you are already familiar with that shell.

#### [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-linux?pivots=apt)
We'll use this to connect to Azure and create our service principle. Install it by running:

````shell
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
````

#### [jq](https://stedolan.github.io/jq/)
A lightweight command-line JSON processor. We'll use this to extract the service principle details returned by Azure CLI. Install it by running:

````shell
sudo apt-get install jq
````

### Configure Terraform Cloud

Use the following Hashicorp guides to setup:
  - A Terraform Cloud account: [Create a Terraform Cloud account and organisation](https://www.terraform.io/docs/cloud/users-teams-organizations/users.html#creating-an-account)
  - A workspace: [Create a workspace](https://www.terraform.io/docs/cloud/workspaces/creating.html)
  - An API token: [Generate an API token](https://www.terraform.io/docs/cloud/users-teams-organizations/users.html#api-tokens)

> ℹ️ **Note:** The API token will only be displayed once. Be sure to store it securely - we'll use it in our script below.

### Set Terraform Cloud Variables

Take the organisation name, workspace name, and access token from the previous step and set them to variables in our script:
```shell
#!/bin/fish

# Set Terraform Cloud variables
set TF_ORG "<insert tf cloud organisation name>"
set TF_WORKSPACE "<insert tf cloud workspace name>"
set TF_TOKEN "<insert tf cloud token>"
```

### Set Azure variables

In the Azure portal, go to your target subscription and take note of the subscription id and tenant name:

![subscription details](./../../assets/img/posts/2021-11-30/subscription.jpg)

Store these values in environment variables. We'll also set name of the service principle that we want to create here:

```shell
set ARM_SUB_ID "<insert target subscription id>"
set ARM_TENANT_NAME "<insert Azure tenant name>"
set ARM_SP_NAME "sp-example"
```
That's all of the manual setups tasks done. We now have enough information to automate the rest of the process!
___

## Script Explanation

### Login to Azure and Create the Service Principle:

Here we'll use

```shell
az login --tenant $ARM_TENANT_NAME.onmicrosoft.com
az account set --subscription $ARM_SUB_ID
set ARM_SP_DETAILS (az ad sp create-for-rbac --role contributor --name $ARM_SP_NAME --sdk-auth)
```

### Extract Service Principle Properties from the Response Using jq:

```shell
set ARM_CLENT_ID (echo $ARM_SP_DETAILS | jq '.clientId' --raw-output)
set ARM_CLIENT_SECRET (echo $ARM_SP_DETAILS | jq '.clientSecret' --raw-output)
set ARM_TENANT_ID (echo $ARM_SP_DETAILS | jq '.tenantId' --raw-output)
```

## Full Script

````shell
#!/bin/fish

# Set Terraform Cloud variables
set TF_ORG "<insert tf cloud organisation name>"
set TF_WORKSPACE "<insert tf cloud workspace name>"
set TF_TOKEN "<insert tf cloud token>"

# Set Azure variables
set ARM_SUB_ID "<insert target subscription id>"
set ARM_TENANT_NAME "<insert Azure tenant name>"
set ARM_SP_NAME "sp-example"

# Create service principle
az login --tenant $ARM_TENANT_NAME.onmicrosoft.com
az account set --subscription $ARM_SUBSCRIPTION_ID
set ARM_SP_DETAILS (az ad sp create-for-rbac --role contributor --name $ARM_SP_NAME --sdk-auth)
set ARM_CLIENT_ID (echo $ARM_SP_DETAILS | jq '.clientId' --raw-output)
set ARM_CLIENT_SECRET (echo $ARM_SP_DETAILS | jq '.clientSecret' --raw-output)
set ARM_TENANT_ID (echo $ARM_SP_DETAILS | jq '.tenantId' --raw-output)


echo '{
  "data": {
    "type":"vars",
    "attributes": {
      "key":"my-key",
      "value":"my-value",
      "category":"env",
      "hcl":false,
      "sensitive":true,
      "description":""
    }
  },
  "relationships": {
    "workspace": {
      "data": {
        "id":"my-workspace",
        "type":"workspaces"
      }
    }
  }
}' | cat > variable.template.json

set -l varkey \
	ARM_CLIENT_ID \
	ARM_CLIENT_SECRET \
	ARM_SUBSCRIPTION_ID \
	ARM_TENANT_ID

set -l varvalue \
	$ARM_CLIENT_ID \
 	$ARM_CLIENT_SECRET \
	$ARM_SUBSCRIPTION_ID \
 	$ARM_TENANT_ID

for i in (seq 1 (count $varkey))
	sed -e "s/my-workspace/$TF_WORKSPACE/" -e "s/my-key/$varkey[$i]/" -e "s/my-value/$varvalue[$i]/" < variable.template.json > variable.json
	echo "Setting variable $varkey[$i] with value $varvalue[$i]"
  	curl -s --header "Authorization: Bearer $TF_TOKEN" --header "Content-Type: application/vnd.api+json" --data @variable.json "https://app.terraform.io/api/v2/vars?filter%5Borganization%5D%5Bname%5D=$TF_ORG&filter%5Bworkspace%5D%5Bname%5D=$TF_WORKSPACE"
end

rm variable.template.json
rm variable.json
````
