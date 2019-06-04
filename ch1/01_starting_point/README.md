# Refactoring 2nd Edition - Chapter 1

## 01 - Starting Point
- Page 2-3

## 02 - Decomposing switch statement
- Page 6-10
- using `extract fnction`, `rename variable`, `rename parameter`

## 03 - Removing The Play Variables
- Page 10-
- using `replace temp with query`, `inline variable`, `change function declaration`


## Sidenote
1. How to use `Extract Function`:
- need to look in the fragment for any variables that will no longer be in scope once you extracted the code into its own function
- For non-modified variables, you could set it as **parameters**
- For modified variables, you could set it on the outside/variable inside the new function (PS: need more care on this one!)

2. A good practice to always call the return value from a function as `result`. That way, you always know its role.

3. With a dynamically typed language such as _Javascript_, it's useful to keep track of types--hence, your defdault name for a parameter includes the type name.

4. How to use `rename variable` and `rename parameter`
- Good practice to use **find and replace** feature on your IDE
- Make sure that you only replace on the appropriate variable/parameter

5. How to use `replace temp with query`
- which mean that, instead of introduction a temporary variable, we directly retrieve the value from a function and parse it to the designated function
- don't forget to compile-test-commit, and then delete the unused parameter

6. How to use `inline variable`
- Reduce the usage of creating a new variable which only being used once.
- Instead of call a function and then put it into a variable, just call the function as a parameter of the related function
- Good practice is by using *find and replace function* from your IDE
- make sure that the variable's colour that you refactored gray (VS Code); which means that it is not being used anymore.
- don't forget to compile-test-commit, and then delete the unused parameter