---
outline: deep
---

# Registration Form

Each **Registration Period** can define a custom form — a set of questions that every requester must answer when
submitting a registration request. Forms are built and managed by a project `ADMIN`.

## Purpose

The form lets admins collect information that is specific to their project and that the standard request model does
not capture — for example, dietary restrictions, emergency contact details, T-shirt size, or any other arbitrary
data.

Without any form fields, a request carries no user-supplied data beyond what the platform itself captures (identity,
dates, number of participants for group requests).

## Form fields

A form is composed of an ordered list of **form fields**. Each field has the following properties:

| Property        | Required | Description                                                                          |
|-----------------|----------|--------------------------------------------------------------------------------------|
| **Label**       | Yes      | The question or instruction shown to the user                                        |
| **Type**        | Yes      | Controls how the input is rendered and how the answer is validated (see below)       |
| **Placeholder** | No       | Hint text displayed inside the input when it is empty                                |
| **Helper**      | No       | Explanatory text shown below the field — useful for instructions or examples         |
| **Order**       | Yes      | Display position within the form — fields are presented in ascending order           |
| **Required**    | No       | When set, the field must be filled before the request can be submitted               |

### Field types

The type drives how the field is rendered on the form and how the answer is validated. The following types are
supported:

| Type       | Description                                               |
|------------|-----------------------------------------------------------|
| `TEXT`     | Single-line free text                                     |
| `TEXTAREA` | Multi-line free text                                      |
| `NUMBER`   | Numeric value                                             |
| `DATE`     | Date picker                                               |
| `CHECKBOX` | Boolean yes/no toggle                                     |
| `SELECT`   | Single choice from a predefined list of options           |

::: info Stored as text
Regardless of type, all answers are stored as plain text in the database. The type is a rendering and validation
hint for the front end — type coercion is handled at the application layer.
:::

## Admin actions

| Action            | Description                                                        |
|-------------------|--------------------------------------------------------------------|
| Add a field       | Append a new field to the form                                     |
| Edit a field      | Change the label, type, placeholder, helper, or required flag      |
| Reorder fields    | Change the display order                                           |
| Remove a field    | Delete a field from the form                                       |

::: warning Impact on existing requests
Editing or removing a field after requests have already been submitted does not retroactively change stored answers.
Existing `request_value` rows retain their original `form_field_id` reference even if the field is later soft-deleted.
Admins should treat form changes during an active registration period with care.
:::

## Filling in the form

When a user submits a registration request, they are presented with the form fields in order. For each field:

- **Required fields** block submission if left empty.
- **Optional fields** can be skipped — a `request_value` row with a null `value` is created, or no row is created
  at all.

The answers become part of the request and are visible to admins when reviewing it.

## Viewing answers

Admins can see all form answers alongside a request. Each answer is displayed with the original field label and the
user-supplied value. If a field was added after the request was submitted, no answer will be shown for it.