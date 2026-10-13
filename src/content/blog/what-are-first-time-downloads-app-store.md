---
title: "What Are First-Time Downloads in App Store Connect?"
description: "First-Time Downloads show new App Store downloads, but they are not the same as active users, retention, revenue, or product-market fit. Here is the plain-English version."
publishDate: 2026-10-05
updatedDate: 2026-10-05
category: "app analytics"
tags:
  - "App Store Connect"
  - "first-time downloads"
  - "App Store search"
  - "indie apps"
  - "Table Talk"
primaryKeyword: "first-time downloads app store connect"
relatedApps:
  - "table-talk"
faq:
  - q: "What are First-Time Downloads in App Store Connect?"
    a: "First-Time Downloads are an App Store Connect Analytics download metric for people downloading an app for the first time. They are useful for acquisition, but they are not the same as active users, retention, or revenue."
  - q: "Do First-Time Downloads include redownloads?"
    a: "No. Apple separates first-time downloads, redownloads, and total downloads in its downloads metrics, so those numbers should not be treated as interchangeable."
  - q: "Does a First-Time Download mean someone used the app?"
    a: "Not necessarily. A download means the app was acquired. Usage needs separate metrics such as sessions, active devices, retention, crashes, support messages, or in-app events."
  - q: "What does App Store Search mean in analytics?"
    a: "Apple describes App Store Search as users who discovered the app within App Store search results. Apple says Search Ads results are included in that source type."
  - q: "Is Table Talk's download data public?"
    a: "No. Dudley can discuss its own measurement approach in public, but private App Store Connect analytics should not be treated as public benchmark data unless Dudley explicitly publishes a sourced window and denominator."
draft: false
---

First-Time Downloads in App Store Connect are a useful acquisition signal: they tell an app maker how many people downloaded the app for the first time. They do not, by themselves, prove that people opened the app, came back later, made a purchase, saw an ad, shared it, or liked it.

That distinction matters. A download is a distribution event. Product health needs separate evidence from usage, quality, support, and money.

Sources: [Apple App Store Connect Analytics: metric definitions](https://developer.apple.com/help/app-store-connect-analytics/reference/metrics-definitions/), [Apple App Store Connect Analytics: acquisition](https://developer.apple.com/help/app-store-connect-analytics/acquisition/acquisition/), [Apple App Store Connect: App Analytics overview](https://developer.apple.com/app-store-connect/analytics/), [Apple App Store search guidance](https://developer.apple.com/app-store/search/), and the current [Table Talk: Conversation Cards App Store listing](https://apps.apple.com/app/id6780714565?pt=128970277&ct=tt-w-first-time-app-store&mt=8).

## The Short Answer

First-Time Downloads answer one narrow question: how many first-time app downloads happened in the selected App Store Connect window?

They are not the same as:

- total downloads;
- redownloads;
- active devices;
- sessions;
- retention;
- conversion to paid;
- ad revenue;
- reviews;
- product-market fit.

Apple’s own Analytics documentation groups metrics into different jobs. Downloads metrics measure how acquisition turns into installs. Usage metrics show how people engage after downloading. Sales metrics cover proceeds, in-app purchases, paying users, and refunds.

So the clean rule is: use First-Time Downloads to understand acquisition, then use other metrics to understand what happened after acquisition.

## First-Time Downloads vs. Total Downloads

Apple separates first-time downloads, redownloads, and total downloads. That separation is important because each number answers a different question.

| Metric | What it is useful for | What it does not prove |
| --- | --- | --- |
| First-Time Downloads | New acquisition | Whether the user opened or kept using the app |
| Redownloads | Returning device or account behavior | New-user demand |
| Total Downloads | A broader distribution count | The quality of the user base |
| Sessions | App usage after install | New-user acquisition by itself |
| Proceeds | Money from App Store commerce | Retention or user satisfaction by itself |

If a small app gets five First-Time Downloads in a day, that can be a real signal. It just is not the whole story. The next question is whether those people opened the app, understood it, came back, hit a bug, made a purchase, or told someone else.

## What App Store Search Means

App Store Connect can also show how users discovered an app. Apple’s acquisition documentation says Analytics can show downloads from sources such as App Store search, App Store browse, app referrers, web referrers, and custom marketing campaigns.

For App Store Search specifically, Apple describes the source type as users who discovered the app within App Store search results. Apple’s search guidance also notes that Apple Ads performance can show up in App Store Search reporting.

That means “App Store Search” is not the same as “someone typed the exact brand name organically and chose the app.” It is a discovery source bucket. Useful, yes. A complete user story, no.

## Why Small App Studios Can Misread the Number

First-Time Downloads feel exciting because they are easy to count. That is the trap.

For a small iPhone app, a download spike can come from search, a friend sharing a link, a social post, a product-page change, a press mention, Apple featuring, paid ads, or plain randomness. If the sample is tiny, one or two people can make the day look meaningful.

The responsible interpretation is usually:

- state the exact date range;
- keep the denominator visible;
- separate first-time downloads from redownloads;
- avoid blending App Store Connect, PostHog, Sentry, AdMob, and support data unless each source is labeled;
- mark missing data as unmeasured, not zero.

That last point is the most important one. If a report is delayed, unavailable, or below a privacy threshold, the right word is “unmeasured.” Calling it zero invents certainty the data does not provide.

## What to Check After Downloads

After First-Time Downloads, the better questions are practical:

- Did people open the app?
- Did sessions happen after the first day?
- Did users reach the core action?
- Did crashes or support messages appear?
- Did the app make any proceeds or ad revenue?
- Did campaign links or source types match the theory?
- Did reviews or ratings move?

Apple’s Analytics overview frames this broader job as measuring discovery, engagement, monetization, retention, and quality. A studio that only watches downloads is flying with one instrument.

## Where Table Talk Fits

[Table Talk: Conversation Cards](/apps/table-talk/) is a live iPhone app from Dudley Development. The current U.S. App Store lookup identifies it as an Entertainment app, bundle `com.nsantulli.tabletalk`, version 1.1.10, requiring iOS 16.6 or later, with the current version release date listed as October 2, 2026.

Table Talk is a useful example because it is a simple consumer app: free conversation cards, no account, offline prompts, optional one-time Remove Ads purchase. For an app like that, First-Time Downloads can tell Dudley whether people are finding the product page. They cannot prove the table actually started talking.

To judge that, Dudley needs separate evidence: sessions, share behavior, support load, crashes, ad and purchase behavior, and whether users come back. The download is the door opening. It is not the dinner.

[Table Talk is free on the App Store](https://apps.apple.com/app/id6780714565?pt=128970277&ct=tt-w-first-time-app-store&mt=8) if you want conversation cards for dinner tables, date nights, friend groups, and work teams.

## Related Dudley Reading

If you are comparing rollout and outcome, keep the same discipline across every metric. A rollout state can tell you whether an update is available. First-Time Downloads measure new acquisition. Neither one proves retention, revenue, or customer love on its own.
