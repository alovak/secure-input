
# Secure Inputs

**This is a POC! You should never use it in production. The document follows "working backwards" approach (kind of) so, do not take it seriously.**

## Introduction

As a payment service provider you may wanted to give your customers the ability to fully customize their checkout page and still reduce the burden of PCI compliance? Some payment companies have already done this:  [Elements](https://stripe.com/payments/elements) from Stripe, [Hosted Fields](https://developers.braintreepayments.com/start/hosted-fields) from Braintree, Spreedly [iFrame Payment Form](https://docs.spreedly.com/guides/adding-payment-methods/iframe/). **Secure-inputs** is a set of UI components that your customers can use to accept credit cards on their website while having full control of the style of their checkout UI.

## Problem

Companies dealing with cardholder data (store, process or transmit) must be inline with PCI Data Security Standard requirements that are designed for service providers and merchants.

E-commerce merchant must assess security of cardholder data using self-assessment questionnaire (PCI SAQ). There are different types of SAQs. They vary by number of questions and required compliance effort. It's in the interest of payment service provider to reduce the amount of work merchant have to do and at the same time provide maximum flexibility for creating custom checkout forms.

There is a SAQ-A for merchants that have fully outsourced all cardholder data functions to PCI DSS compliant third-party service providers. This SAQ is relatively easy to complete. But what does it mean "fully outsourced all cardholder data functions"? Here are the important points:

1. all processing of cardholder data is entirely outsourced to PCI DSS validated third-party service providers;
2. merchant does not electronically store, process, or transmit any cardholder data on merchant systems or premises, but relies entirely on a third party(s) to handle all these functions;
3. merchant has confirmed that all third party handling storage, processing, and/or transmission of cardholder data are PCI DSS compliant;
4. all elements of the payment page delivered to the consumer’s browser originate only and directly from a PCI DSS validated third-party service provider.

Points 1-2 are usually solved with sending data directly to the 3rd party service provider via redirects, AJAX/XHR requests. Point 3 is a paperwork. **Secure-input** solves the most complex point 4.

## Solution

**Secure-inputs** replaces checkout form elements on the merchant website with elements that are hosted by you (PCI DSS compliant payment service provider). Thus, merchants may use SAQ-A for self-assessment and have full control on the look and feel of their payment flow.

## How it works

Everything starts from checkout page. Merchant creates payment form with the desired design and uses placeholders for cardholder data elements (card number, cvc, expiration date).

## How to Get Started

## Backend Endpoints

## Customer Quote

# JS-SDK


## HTTPS on js.power.dev

Password for myCA.pem is **1234**

This is a how to for self signed certificates: https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/


## How to test pipeline locally

Don't forget that you need .env file with IAM user that can assume DeployerRole:

```
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=YYY
```

Then, to run deployment script:

> docker-compose run pipeline sh

check what we run in bitbucket-pipelines.yml step/script and reproduce here like:

> export ACCOUNT_ID=$ACCOUNT_STAGING_ID
> export AWS_DEFAULT_REGION=us-east-1
> export S3_BUCKET=cdn.powerpayments.tech
> ./scripts/s3_deploy.sh

Hello from 2019!
