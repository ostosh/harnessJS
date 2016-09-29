# harnessJS

harnessJS is a JavaScript framework for managing iframes. Documentation, guides and examples coming soon.


### Installation:

1. Download the src code
2. Import the module into your application
```html
<script type="text/javascript" src="harness.js"></script>
```

### Public API:

[Builder](harnessJS.js#L174): builds instances of [Subject](harness.js#L30) iframe.

   + [usingResource](harnessJS.js#L193)

   + [usingContainer](harnessJS.js#L204)

   + [buildSubject](harnessJS.js#L215)

[Subject](harnessJS.js#L30): subject iframe.

   + [init](harnessJS.js#L48)

   + [killSubject](harnessJS.js#L67)

   + [setReadyState](harnessJS.js#L74)

   + [getReadyState](harnessJS.js#L85)

   + [bindReadyStateHandlers](harnessJS.js#L100)

   + [getChildContext](harnessJS.js#L115)
  
   + [wait](harnessJS.js#L130)
  
   + [executeFunction](harnessJS.js#L160)
