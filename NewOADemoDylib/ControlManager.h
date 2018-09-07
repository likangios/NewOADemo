//
//  ControlManager.h
//  LeanCloudDemo
//
//  Created by perfay on 2018/9/4.
//  Copyright © 2018年 luck. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ControlManager : NSObject
+ (instancetype)sharInstance;
- (BOOL)isPush;
@end
