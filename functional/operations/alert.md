---
outline: deep
---

# Alert

An **Alert** is a structured container that groups a status, a topic, and a communication thread. It is used to track
and discuss any situation that requires formal follow-up.

::: info Option required
Alerts are only available if the **ALERT** option is enabled on the project, which itself requires **COMMUNICATION** and
**ACTIVITY** to be enabled.
:::

## Purpose

An alert can be created at any time, by any user with the appropriate rights, and for any reason. It is not tied to a
specific movement. It provides a formal, trackable way to manage an ongoing situation.

## Status

| Status        | Description                                    |
|---------------|------------------------------------------------|
| `IN_PROGRESS` | The alert is open and being actively monitored |
| `RESOLVED`    | The situation has been resolved                |
| `CANCELLED`   | The alert has been closed without resolution   |

## Communication thread

The alert contains a series of messages that form its communication thread. When writing a message, the user selects a *
*sender**:

| Sender option                 | Description                                                                                                                      |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| The user themselves (default) | The message is sent on behalf of the logged-in user                                                                              |
| An outside activity           | The message is sent on behalf of any group currently out on an activity *(any movement of type `OUT` with an activity attached)* |

This makes it possible to simulate exchanges between on-site staff and groups in the field.

## Relationship to movements and activities

An alert does not require a specific movement to exist. However, its communication thread can reference **any activity
that currently has an active outside movement**. As groups return (via an `IN` movement), their activity is no longer
available as a sender.

## Key attributes

| Attribute   | Description                                                                   |
|-------------|-------------------------------------------------------------------------------|
| Title       | A short description of the alert's topic                                      |
| Date & time | When the alert was created                                                    |
| Status      | Current state of the alert                                                    |
| Messages    | The communication thread — each message has a timestamp, a body, and a sender |
