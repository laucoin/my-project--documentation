# Registration Period

A **Registration Period** defines when and how a project accepts registration requests. It is created and managed by a
project `ADMIN`.

## Purpose

Without a registration period, a project does not appear in the list of projects open for registration and cannot
receive new requests.

## Two distinct date concepts

A registration period carries two independent sets of dates, serving different purposes.

### Registration window

The period during which users are allowed to submit registration requests.

| Setting           | Required | Description                                                      |
|-------------------|----------|------------------------------------------------------------------|
| Window start date | No       | From when registrations are open *(open immediately if not set)* |
| Window end date   | No       | Until when registrations are open *(open-ended if not set)*      |

### Project coverage

The portion of the project that this registration covers — i.e. the dates a registered participant is expected to
attend.

| Setting             | Required | Description                                                                              |
|---------------------|----------|------------------------------------------------------------------------------------------|
| Coverage start date | No       | From when the registration applies within the project *(defaults to project start date)* |
| Coverage end date   | No       | Until when the registration applies within the project *(defaults to project end date)*  |

## Other settings

| Setting               | Required | Description                                                                                              |
|-----------------------|----------|----------------------------------------------------------------------------------------------------------|
| Audience              | Yes      | Who can register: individuals, groups, or both                                                           |
| Maximum registrations | No       | The maximum number of accepted registrations                                                             |
| Fixed price           | No       | A flat fee applied once per registration                                                                 |
| Variable price        | No       | A per-person fee multiplied by the number of participants                                                |
| Day variable price    | No       | A per-person per-day fee multiplied by the number of participants and the number of days each is present |

### Audience options

| Option     | Description                                        |
|------------|----------------------------------------------------|
| Individual | Only individual registration requests are accepted |
| Group      | Only group registration requests are accepted      |
| Both       | Both individual and group requests are accepted    |

## Pricing

The three pricing types can be combined. The total cost of a registration is the sum of all active portions:

| Portion          | Calculation                                                                |
|------------------|----------------------------------------------------------------------------|
| **Fixed**        | Charged once per registration, regardless of the number of participants    |
| **Variable**     | Rate × number of participants                                              |
| **Day variable** | Rate × number of participants × number of days of presence per participant |

::: tip Example
For a camp with a day variable price of 10 € per participant per day:

- A participant present for 5 days contributes 50 €
- A participant present for 3 days contributes 30 €
  :::

::: warning Day variable price requires dates
The day variable price can only be calculated if at least one of the following has a defined date range: the
registration period's **project coverage** or the **project** itself. Without any date reference, the number of days of
presence cannot be determined.
:::

The day variable pricing uses each participant's actual presence dates, which are collected during the
`NEED_SPECIFICATION` step of a group registration and may be more restrictive than the coverage period.

## Registration form

A registration period can define a set of custom questions that users must answer when submitting a request. See
[Registration Form](/functional/registration/registration-form).
