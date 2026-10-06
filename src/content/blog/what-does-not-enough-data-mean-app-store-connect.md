---
title: "What Does Not Enough Data Mean in App Store Connect?"
description: "Not Enough Data usually means App Store Connect does not have enough eligible data to show a metric. It is not the same as zero installs, zero usage, or zero revenue."
publishDate: 2026-10-06
updatedDate: 2026-10-06
category: "app analytics"
tags:
  - "App Store Connect"
  - "Not Enough Data"
  - "app analytics"
  - "indie apps"
  - "privacy"
  - "measurement"
primaryKeyword: "not enough data app store connect"
relatedApps:
  - "table-talk"
faq:
  - q: "What does Not Enough Data mean in App Store Connect?"
    a: "It usually means App Store Connect does not have enough eligible data to display the selected metric, date range, filter, or feature view. It should be treated as unmeasured, not automatically as zero."
  - q: "Does Not Enough Data mean my app has no downloads?"
    a: "No. A missing chart or dashboard message is not the same as confirmed zero downloads. Check the exact metric, date range, filters, and whether that metric has an availability threshold."
  - q: "Why does App Store Connect hide some analytics?"
    a: "Apple's Analytics documentation says some metrics only appear after certain conditions are met, and usage data is based on users who opted in to share analytics with developers."
  - q: "Can I use Not Enough Data as a product failure signal?"
    a: "Only carefully. It can be a weak-signal warning that the sample is thin, but it is not a measured failure rate unless you have another source with a stated window and denominator."
  - q: "What should an indie app maker write in a report?"
    a: "Write the metric, source, date range, filters, and status. If the row is unavailable, use unmeasured or measurement blocked instead of inventing a zero."
draft: false
---

Not Enough Data in App Store Connect usually means Apple does not have enough eligible data to show the metric, view, date range, or filter you selected. It is not the same thing as zero downloads, zero users, zero revenue, or a failed app.

The clean interpretation is: the metric is unmeasured in that view. Before you make a decision, check which metric is missing, what date range you selected, which filters are active, and whether Apple says that metric has an availability threshold.

Sources: [Apple App Store Connect Analytics metric definitions](https://developer.apple.com/help/app-store-connect-analytics/reference/metrics-definitions/), [Apple App Analytics overview](https://developer.apple.com/app-store-connect/analytics/), [Apple App Store Connect sales analytics](https://developer.apple.com/help/app-store-connect-analytics/monetization/sales), and [Apple App Analytics & Privacy](https://www.apple.com/legal/privacy/data/en/app-analytics/).

## The Short Answer

When App Store Connect says Not Enough Data, read it as a data availability message. It means the dashboard cannot responsibly show the selected result yet.

That can happen because:

- the selected date range is too small;
- the app or feature has too little activity;
- a metric has a minimum availability condition;
- a filter splits the sample into tiny pieces;
- usage data depends on people opting in to share analytics;
- the metric does not apply to the app's current business model or enabled features.

The important part is what not to do. Do not turn a missing row into a confident number. If the dashboard cannot show the metric, the public-safe label is "unmeasured" or "measurement blocked."

## Why It Is Not the Same as Zero

Zero is a measurement. Not Enough Data is a missing or unavailable measurement.

Those two states lead to different decisions. If a report says an app had zero purchases in a stated date range, that is a measurable result. If the report cannot display paying users, proceeds, retention, or active devices, the answer is weaker: that view does not provide enough evidence.

For small apps, this distinction matters because one or two people can change the shape of a chart. A small sample is not useless, but it should be handled honestly.

## Apple Metrics Have Availability Rules

Apple's metric definitions make clear that App Store Connect Analytics is grouped by different jobs: App Store metrics, downloads, sales, usage, in-app events, subscriptions, and App Clips.

Some of those metrics have explicit availability conditions. Apple says App Store metrics are available once an app has at least five first-time downloads or pre-orders. Downloads metrics are available once an app has at least five first-time downloads. Usage metrics are available when there are at least five active devices in the selected date range, and usage totals are based on App Store users who opt in to share data with developers.

Apple also says some feature-specific metrics appear only after the app uses the relevant feature and has enough data for that feature. For example, in-app event metrics require enough first-time downloads from at least one in-app event before that data appears.

So a blank or unavailable view can mean the app has not crossed the relevant availability condition. It does not automatically tell you the underlying behavior is exactly zero.

## Sales Data Has Its Own Rules

Monetization views are separate from acquisition and usage views.

Apple's sales analytics documentation says sales data appears in the Analytics dashboard when at least one purchase has occurred, either as a paid app purchase or an in-app purchase. It also defines proceeds as the estimated amount the developer will receive from App Store sales after applicable taxes and Apple's commission.

That means an app can have App Store visibility, downloads, and usage while still lacking a useful sales dashboard. It also means sales, proceeds, paying users, and refunds should not be mixed together without labeling the source and definition.

## What to Check Before Reacting

If you see Not Enough Data, slow down and check the measurement setup before you rewrite the product story.

Start with the basics:

- Which metric is selected?
- What exact date range is selected?
- Are any territory, source, device, app version, campaign, or purchase filters active?
- Does the metric require a feature the app does not use?
- Does Apple's definition say the metric has a minimum activity condition?
- Is the dashboard about downloads, usage, sales, retention, benchmarks, or a feature like in-app events?

Then check whether another source answers a narrower question. App Store Connect downloads might show acquisition. A product analytics tool might show sessions. Sentry might show crashes. Support mail might show repeated friction. Ad platforms might show ad requests or estimated earnings.

Each source gets its own label, window, and denominator.

## How Indie Apps Should Report It

For a small app studio, the safest reporting style is boring and precise.

Use language like:

| Bad phrasing | Better phrasing |
|---|---|
| "No one used the app." | "Usage is unmeasured in App Store Connect for this window." |
| "Revenue is zero." | "ASC proceeds are unmeasured in this view; no public revenue claim." |
| "Retention failed." | "Formal retention is unavailable; sample is too thin to claim a rate." |
| "The campaign did not work." | "Campaign attribution is unmeasured or unavailable for this date range." |
| "The app is dead." | "Available signals are thin; more evidence is needed before a disposition." |

This is not word games. It keeps decision-making clean. A missing measurement can still be a warning, especially if every adjacent signal is thin. But it should not become a made-up result.

## Where This Fits in Dudley Writing

Dudley Development uses this same rule in public app-factory writing: downloads, usage, crashes, support, ad earnings, and App Store proceeds are different evidence streams.

That is why a [First-Time Downloads explainer](/blog/what-are-first-time-downloads-app-store/) separates acquisition from retention and revenue, and why the public [Table Talk](/apps/table-talk/) page describes product behavior without turning private dashboards into public benchmarks.

The habit is simple: say what is measured, say the window, and say what is still unmeasured. Missing data may be disappointing. Invented certainty is worse.

## FAQ

### What does Not Enough Data mean in App Store Connect?

It usually means App Store Connect does not have enough eligible data to display the selected metric, date range, filter, or feature view. It should be treated as unmeasured, not automatically as zero.

### Does Not Enough Data mean my app has no downloads?

No. A missing chart or dashboard message is not the same as confirmed zero downloads. Check the exact metric, date range, filters, and whether that metric has an availability threshold.

### Why does App Store Connect hide some analytics?

Apple's Analytics documentation says some metrics only appear after certain conditions are met, and usage data is based on users who opted in to share analytics with developers.

### Can I use Not Enough Data as a product failure signal?

Only carefully. It can be a weak-signal warning that the sample is thin, but it is not a measured failure rate unless you have another source with a stated window and denominator.

### What should an indie app maker write in a report?

Write the metric, source, date range, filters, and status. If the row is unavailable, use unmeasured or measurement blocked instead of inventing a zero.
