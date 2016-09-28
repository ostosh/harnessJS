(function( window ) {

  /**
  * Creates new {@link BuilderUtils} instances.
  *
  * @constructor
  */
  var BuilderUtils = function(){};
  
  /**
  * Tests the uri of a static web resource to see if it is available.
  *
  * @param {string} uri The relative path of a html resource to load.
  * @return {boolean} true if the resource given by the uri is available.
  */
  BuilderUtils.prototype.resourceExists = function( uri ) {
    if(!uri)
      throw "Error: uri undefined.";
    var http = new XMLHttpRequest();
    http.open( 'GET', uri, false );
    http.send();
    return http.status === 200;
  };

  /**
  * Instantiate single instance of {@link BuilderUtils}.
  */
  var builderUtils = new BuilderUtils();

  /**
  * Creates new {@link Subject} instances.
  *
  * @constructor
  */
  var Subject = function() {
  	  
    /** @private {!document.documentElement} */
    this.subjectDom_;
    
    /** @private {boolean} */
    this.readyState_ = false;
    
    /** @private {boolean} */
    this.built_ = false;
    
  };

  /**
  * Binds a subjectDom to Subject instance. 
  *
  * @param {string} uri The relative path of a html resource to load.
  * @param {Element} container DOM node to bind iframe subject to.
  */
  Subject.prototype.init = function( uri, container ) {
    if( typeof uri !== 'string' )
      throw "Error: invalid uri.";

    var iframe = document.createElement( 'iframe' );
    iframe.src = uri;
    if( container instanceof Element )
      container.appendChild( iframe );
    else
      document.body.appendChild( iframe );
    this.subjectDom_ = iframe;
  };

  /**
  * Removes the {!Subject.subjectDom_} from the DOM. 
  */
  Subject.prototype.killSubject = function() {
    this.subjectDom_.parentNode.removeChild( this.subjectDom_ );
  };

  /**
  * Sets the readyState of the Subject instance. 
  *
  * @param {boolean} state The new ready state of the Subject instance.
  */
  Subject.prototype.setReadyState = function( state ) {
    if ( typeof state !== 'boolean' )
      throw "Error: invalid state of <" + state + "> given.";
    this.readyState_ = state;
  };

  /**
  * Gets the readyState of the Subject instance. 
  *
  */
  Subject.prototype.getReadyState = function() {
    return this.readyState_;
  };

  /**
  * Bind readyState event handlers a newly created Subject instance.
  * 
  * @invariant Ready State handlers have not already been bound
  * @invariant Subject instance subjectDom_ field is set with Subject.usingUri
  *
  */
  Subject.prototype.bindReadyStateHandlers = function() {
    if( this.built_ )
      throw "Error: ready state handlers have already been bound to this instance";

    var ts = this;
    this.subjectDom_.onload = function() {
      ts.setReadyState( true );
    };

    this.subjectDom_.contentWindow.onunload = function() {
      ts.setReadyState( false );
    };
    this.built_ = true;
    };

  /**
  * Sets the URI of a html resource to include as a test subject. 
  *
  * @param {string} nameSpace The name of a name space object at subject 
  *   application's global scope.
  * @return {Object} The namespace found.
  */
  Subject.prototype.getChildContext = function( nameSpace ) {
    if ( typeof nameSpace !== 'string' )
      throw "Error: given nameSpace of <" + nameSpace + "> invalid.";
    if(this.subjectDom_.contentWindow[ nameSpace ] === undefined)
      throw "Error: given nameSpace of <" + nameSpace + "> not found in subject's global scope.";
    return this.subjectDom_.contentWindow[ nameSpace ];
  };

  /**
  * Blocks execution until Subject instance's ready state is true or optional 
  *   promise returns true.
  *
  * @param {function} func Optional callback to be executed when blocking 
  *   condition is resolved.
  * @param {function} promise Optional polling function that will override the 
  *   Subject instance's ready state. Function must eventually resolve to true.
  * @return {Object} Return value of the optional callback given. Otherwise, the 
  *   Subject instance's ready state.
  */
  Subject.prototype.wait = function ( func, promise ){
    var ts = this;
    window.setTimeout( function() {
      var waitCondition;
      if ( typeof promise === 'function' )
        waitCondition = promise();
      else
        waitCondition = ts.getReadyState();

      if ( typeof func !== 'function' )
        func = ts.getReadyState;

      if( !waitCondition )
        ts.wait( func, promise );
      else
        return func();
    }, 200 );
  };

  /**
  * Executes given callback function when Subject instance's ready state is true.
  *
  * @param {function} func Callback to be executed when instance's ready state 
  *   is true.
  * @return {Object} Return value of the optional callback given.
  */
  Subject.prototype.executeFunction = function(func) {
    if ( typeof func !== 'function' )
      throw "Error: given script <" + func + "> is not a valid function";
    return this.wait(func);
  };


  /**
  * Creates new {@link Builder} instances.
  *
  * @constructor
  */
  var Builder = function() {
    /** @private {boolean} */
    this.isBuilt_;
    
    /** @private {String} */
    this.uri_ = '';

    /** @private {Element} */
    this.container_;

    /** @private {String} */
    this.style_ = '';
 
    /** @private {!Subject} */
    this.subject_;
  };

  /**
  * Sets the resource to create Subject with. 
  *
  * @param {string} uri The relative path of a html resource to load.
  */
  Builder.prototype.usingResource = function( uri ) {
    if( typeof uri_ !== 'string' || !builderUtils.resourceExists( uri ) )
      throw "Error: given uri <"+uri+"> not found.";
    this.uri_ = uri;
  };
  
  /**
  * Sets container to bind the Subject to. 
  *
  * @param {Element} element container to bind the Subject to.
  */
  Builder.prototype.usingContainer = function( element ) {
    if( !( element instanceof Element ) )
      throw "Error: invalid container element ";
    this.container_ = element;
  };

  /**
  * Sets the style of a Subject element. 
  *
  * @param {string} style The string representation of one or more inline CSS 
  *   styles to include.
  */
  Builder.prototype.usingStyle= function(style) {
    if(typeof style_ !== 'string' )
      throw "Error: given style <" + style + "> is invalid.";
    this.style_ = style;
  };

  /**
  * Create instance of Subject bound with application bound under child 
  *   documentElement. 
  *
  * @invariant Instance of Builder has not already been used to build a instance 
  *   of Subject
  * @return {!Subject} The namespace found.
  */
  Builder.prototype.buildSubject = function() {
    if ( this.isBuilt_ )
      throw "Error: subject instance can only be used to build one subject";
 
    var subject = new Subject();
    subject.init( this.uri_, this.container_ );
    subject.bindReadyStateHandlers();
    this.isBuilt_ = true;
    return subject;
  };

  window.harness = Builder;


}( window ));



    


