# ReactNativeS3
--------------

This is an example React Native app which uses `react-native-aws3` to upload assets to AWS S3.

### Notable Dependencies
* To access the camera roll assets we use `react-native-image-picker`.
* If you can't pick images from the camera roll make sure to go through the `react-native-image-picker` install steps [here](https://github.com/marcshilling/react-native-image-picker)

### Prerequisites
* You need these details to upload to S3:
  * AWS_ACCESS_KEY_ID
  * AWS_SECRET_ACCESS_KEY
  * AWS_BUCKET_NAME
  * AWS_BUCKET_REGION
* When you have them, enter them at the top of `index.ios.js`

### Generating/Getting the AWS Info
* Do all of this in your [AWS console](https://console.aws.amazon.com/console/home)
* Create an AWS S3 bucket to store your uploaded assets in.
  * Take note of the bucket's region code and its full name.
  * You find the region code by looking up its name [here](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
* Create a user via your AWS console under the IAM section.
  * Store their generated AWS key and secret somewhere safe.
* Create a policy with Put objection actions included for the target bucket resource.
* Assign this policy to the newly created user.

### Discussion/Implementation
* Make sure your AWS details have been entered into `index.ios.js`.
* When using `react-native-aws3` out of the box, I was encountering an error:

> NSURLSession/NSURLConnection HTTP load failed (kCFStreamErrorDomainSSL, -9802)

* After some research I found out the origin of this error which was causing the first error

> The certificate for this server is invalid. You might be connecting to a server that is pretending to be “${YOUR_BUCKET_NAME}.s3.amazonaws.com” which could put your confidential information at risk

* So the question is how to use self signed certs in development which don't cause this error. There are two options for this, the hotfix and production ready solution.

#### Hotfix - iOS
* Modify how the request challenge is handled by inserting the following snippet below the line `#pragma mark - NSURLSession delegate` in the file `RCTHTTPRequestHandler.m`.

> SHOULD NOT BE LEFT IN AdHoc or Release builds

```
- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential *credential))completionHandler
{
  completionHandler(NSURLSessionAuthChallengeUseCredential, [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust]);
}
```
[source] (http://stackoverflow.com/a/36603666)

#### Production
* Use `letsencrypt` to generate signed certs for development
[source](http://stackoverflow.com/a/36368360)

#### Extra Info - iOS
* The iOS `info.plist` NSExceptionDomains dictionary is as follows:

```xml
<key>NSAppTransportSecurity</key>
  <dict>
  <key>NSExceptionDomains</key>
  <dict>
    <key>localhost</key>
    <dict>
      <key>NSTemporaryExceptionAllowsInsecureHTTPSLoads</key>
      <false/>            
      <key>NSIncludesSubdomains</key>
      <true/>
      <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
      <true/>
      <key>NSTemporaryExceptionMinimumTLSVersion</key>
      <string>1.0</string>
      <key>NSTemporaryExceptionRequiresForwardSecrecy</key>
      <false/>
    </dict>
  </dict>
</dict>
```
[source](https://github.com/facebook/react-native/issues/1563)
