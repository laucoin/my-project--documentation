# Vehicle

A **Vehicle** is a means of transport that can be associated with a movement. Its primary purpose is to record which
vehicle was used and who was driving it, so that the driver can be identified in the event of a traffic incident.

::: info Option required
Vehicles are only available if the **VEHICLE** option is enabled on the project.
:::

## Use in movements

Attaching a vehicle to a movement is optional. When attached, the driver must be identified among the participants
included in that movement.

## Availability dates

A vehicle can have its own availability dates (start and end). These are optional. If not set, the vehicle is considered
available for the full duration of the project.

::: info Attendance date constraint
A vehicle's availability dates must stay within the project dates.
:::

## Key attributes

| Attribute                      | Description                                      |
|--------------------------------|--------------------------------------------------|
| License plate                  | The vehicle's registration number                |
| Brand                          | The vehicle manufacturer                         |
| Model                          | The vehicle model                                |
| Availability start date & time | From when the vehicle is available *(optional)*  |
| Availability end date & time   | Until when the vehicle is available *(optional)* |
| Active                         | Whether the vehicle is active                    |

## Relationships

| Related object | Relationship                                       |
|----------------|----------------------------------------------------|
| Project        | A vehicle belongs to one project                   |
| Movement       | A vehicle can be attached to one or more movements |
