//
//  ControlManager.m
//  LeanCloudDemo
//
//  Created by perfay on 2018/9/4.
//  Copyright © 2018年 luck. All rights reserved.
//

#import "ControlManager.h"
#import <AVOSCloud/AVOSCloud.h>
static ControlManager *shareInstance;
@implementation ControlManager
+ (instancetype) sharInstance {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        shareInstance = [[ControlManager alloc]init];
    });
    return shareInstance;
}
- (BOOL)isPush{
    AVObject *classObject = [AVObject objectWithClassName:@"PushControl"];
    [classObject refresh];
    NSArray *object = [classObject objectForKey:@"results"];
    if (object.count) {
        NSString *isPush = [object[0] objectForKey:@"isPush"];
        if ([isPush isEqualToString:@"1"]) {
            return  YES;
        }
        else{
            return  NO;
        }
    }
    return  NO;
}
@end
