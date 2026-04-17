---
outline: deep
---

# Functional Documentation

The application is designed to manage various aspects of group care for minors. Everything revolves around a Project, which represents a group care facility for minors in the legal sense.

## Sections

There are 2 main sections in the functional documentation, in each section, the documentation is organized in modules. A module is a self-contained part of the application that manages a specific aspect of the business logic. Each module has its own data model and features. In brief, a module has a well-defined scope and can be developed, tested, and maintained independently from the rest of the application.

- [Business Objects](/functional/business-objects/): the objects' definition, structure, and lifecycle. This part is independent of the user interface; it describes the data model concepts, not the features.
	- [Core](/functional/business-objects/core/)
	- [Document](/functional/business-objects/document/)
	- [Operations](/functional/business-objects/operations/)
	- [Preparation](/functional/business-objects/preparation/) *(draft)*
	- [Registration](/functional/business-objects/registration/)
- [Features](/functional/features/): the user-facing features of the application and how they are implemented on top of the business objects. This part describes the actions a user can take.
