# Learning new languages with Advent of Code 2023

To practice algorithms and problem solving I'll solve each day's problems in javascript and then use these excercises to
become familiar with other programming languages and tooling.

## Project Layout

All of the languages sub-projects are symlinked to the same data directory. For each day, the data directory
contains inputs along with their verified correct outputs. Each sub-project contains a `run` script that will run each day's
problem with the inputs and verify that the result matches the expected output.

## Javascript

I use nodejs and javascript as a swiss army knife for quickly solving programming challenges of small to medium scope.
Python would be a good alternative here, but I am more producitve using javascript from years of being a front end developer.


To run javascript examples cd into the js directory and use the `run` script file thats in the `js/src/bin`
directory to test that the function produces the expected output.

```
cd js
./run 1
./run 2
./run 25
```

To run the unit tests for the Heap and UniqueHeap data structures, you must first install the dev dependencies

```
npm install
npm test
```


## Typescript

While I like the simplicity of javascript with dynamic typing, it can become cumbersome to reason about
when working on larger projects with more than 1 developer. For these types of projects I like to use typescript
to statically verify everybody is on the same page when it comes to data types and function signatures.

I've included just a single day that uses a custom defined data structure to demonstrate that I'm familiar with typescript
and can create collection data structures that use generics to remain type safe. To run this example you must first
`npm install` to locally install the typescript compiler dependency.

```
cd typescript
npm install
./run 17
```

This example also contains unit tests for the type safe Heap and UniqueHeap data structures.

```
npm test
```

## C++

Even though the browser is my preferred platform for quickly prototyping and shipping a user interface to customers, it does have its limitations
in terms of performance and tooling for creating 3D interfaces and data visualizations. Unreal Engine 5 is a really 
impressive tool for creating immersive environments and animated 3D data visualizations. Because its free to use and install
I've been having a lot of fun playing around with it. In order to get the most out of unreal and really customize
it to produce business applications instead of games, I needed to have a mucher deeper understanding of extending
Unreal Engine behavior using C++. Small code challenges like these are a great way to get used to how things like
classes and memory management workt at a low level before moving on to all the Unreal Engine tutorials.


This project uses cmake to build and run each day, however thats been abstracted away into the `run` script.

This project has only been tested on MacOS 14.

```
cd cpp
./run 1
./run 2
./run 3
```


## Swift

Swift has been one of my favorite languages to learn. It has been a nice balance of being fairly straightforward to use
and memory safe without having a full on mark and sweep garbage collector. I also wanted to be able to build native apps 
for the Apple devices that I own, and I feel right at home learning Swift-UI after having experience building apps with typescript
react.


This project was built using Swift Package Manager (SwiftPM), but like the other examples that has been abstracted away in the `run` script

```
cd swift
./run 1
./run 2
./run 3
```
