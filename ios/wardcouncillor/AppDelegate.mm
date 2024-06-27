#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

// #import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"wardcouncillor";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // [GMSServices provideAPIKey:@"AIzaSyCG4Tc5v-7PBF4JO-6NKx2aX0xDNCZ4BVM"];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}


- (BOOL) application: (UIApplication *)application
             openURL: (NSURL *)url
             options: (NSDictionary<UIApplicationOpenURLOptionsKey, id> *) options
{
  if ([self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url]) {
    return YES;
  }
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL) application: (UIApplication *) application
continueUserActivity: (nonnull NSUserActivity *)userActivity
  restorationHandler: (nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
    if (self.authorizationFlowManagerDelegate) {
      BOOL resumableAuth = [self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:userActivity.webpageURL];
      if (resumableAuth) {
        return YES;
      }
    }
  }
  return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
