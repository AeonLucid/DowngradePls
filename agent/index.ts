/**
 * Parameters.
 */
var identifierItem = ObjC.classes.NSString.stringWithUTF8String_(Memory.allocUtf8String("985746746"));
var identifierVersion = ptr(0);

/**
 * Find functions required.
 */
const resolver = new ApiResolver('objc');

const allocMatch = Module.findExportByName(null, 'objc_alloc')!;
const allocFunc = new NativeFunction(allocMatch, 'pointer', ['pointer']);

const initMatch = resolver.enumerateMatches('-[SSVInstallManagedApplicationRequest initWithItemIdentifer:externalVersionIdentifier:bundleIdentifier:bundleVersion:]');
const initFunc = new NativeFunction(initMatch[0].address, 'pointer', ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']);

const startMatch = resolver.enumerateMatches('-[SSVInstallManagedApplicationRequest startWithResponseBlock:]');
const startFunc = new NativeFunction(startMatch[0].address, 'pointer', ['pointer', 'pointer', 'pointer']);

/**
 * Initialize request.
 */
var ssvInstance = allocFunc(ObjC.classes.SSVInstallManagedApplicationRequest.handle);
var ssvResult = initFunc(
    ssvInstance,
    ObjC.selector('initWithItemIdentifer:externalVersionIdentifier:bundleIdentifier:bundleVersion:'),
    identifierItem,
    identifierVersion,
    ptr(0),
    ptr(0)
);

console.log('[*] Initialized request.');

/**
 * Execute request.
 */
const onResponse = new ObjC.Block({
    retType: 'void',
    argTypes: ['pointer', 'pointer', 'pointer'],
    implementation: (a: NativePointer, b: NativePointer, c: NativePointer) => {
        console.log('[*] Response:', a, b, c);

        if (a.toInt32() === 0) {
            console.log('[*] Failed to install.');
            // TODO: Error handling.
            // [[*(b +  32) UTF8String] MCVerboseDescription]
        } else {
            console.log('[*] Successfully installed.');
        }
    }
});

startFunc(
    ssvResult,
    ObjC.selector('startWithResponseBlock:'),
    onResponse
);

console.log('[*] Started request.');