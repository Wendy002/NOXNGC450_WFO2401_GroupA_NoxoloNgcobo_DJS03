## Discussion and Reflection

- The rationale behind the refactoring decisions made, including the choice of objects and functions.
**Functions**:
    - createBookPreview(fragment, slicedObject): Creates book preview elements for the given sliced object and appends them to the fragment.
    - createObjectEntries(objectWithEntries, fragment): Creates option elements for the given object and appends them to the fragment.
    - filterBooks(books, filters): Filters books based on the given filters and returns the filtered array.
    - updateShowMoreButton(): Updates the "Show more" button text and disabled state based on the number of remaining books.
    - setThemeBasedOnUserPreference(): Sets the theme based on the user's preferred color scheme.
    - changeTheme(theme): Changes the theme of the webpage.

- How abstraction has made the code more maintainable and extendable.

**Modularity**: Abstraction has allowed us to break down the code into smaller, independent modules (functions) that perform specific tasks. This makes it easier to maintain and update individual modules without affecting the entire codebase.
**Reusability**: Abstracted functions like createBookPreview and createObjectEntries can be reused throughout the code, reducing code duplication and making it easier to add new features.


- Any challenges faced during the refactoring process and how they were overcome.
**challenges**
    - It was difficult to identify pieces of code that goes together
    - This resulted in lot of bugs when tring to created functions for certain parts
    - over refactoring
**solution**
    - looked at the html code , the website it self to try finf pieces of code that goes together
    - only refactored code that needed to be refactored

- Reflections on how this exercise has deepened your understanding of JavaScript programming concepts.
    - This was a huge learning curve, lot of struggles but learnt a lot from those struggles, bugs and everything
