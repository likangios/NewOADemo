//  weibo: http://weibo.com/xiaoqing28
//  blog:  http://www.alonemonkey.com
//
//  NewOADemoDylib.m
//  NewOADemoDylib
//
//  Created by perfay on 2018/9/3.
//  Copyright (c) 2018年 luck. All rights reserved.
//

#import "NewOADemoDylib.h"
#import <CaptainHook/CaptainHook.h>
#import <UIKit/UIKit.h>
#import <Cycript/Cycript.h>
#import <MDCycriptManager.h>
#import "TestViewController.h"
#import <AVOSCloud/AVOSCloud.h>
#import "ControlManager.h"
CHConstructor{
    NSLog(INSERT_SUCCESS_WELCOME);
    
    [[NSNotificationCenter defaultCenter] addObserverForName:UIApplicationDidFinishLaunchingNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification * _Nonnull note) {
        
#ifndef __OPTIMIZE__
        CYListenServer(6666);

        MDCycriptManager* manager = [MDCycriptManager sharedInstance];
        [manager loadCycript:NO];

        NSError* error;
        NSString* result = [manager evaluateCycript:@"UIApp" error:&error];
        NSLog(@"result: %@", result);
        if(error.code != 0){
            NSLog(@"error: %@", error.localizedDescription);
        }
#endif
        
    }];
}


CHDeclareClass(CustomViewController)

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wstrict-prototypes"

//add new method
CHDeclareMethod1(void, CustomViewController, newMethod, NSString*, output){
    NSLog(@"This is a new method : %@", output);
}

#pragma clang diagnostic pop

CHOptimizedClassMethod0(self, void, CustomViewController, classMethod){
    NSLog(@"hook class method");
    CHSuper0(CustomViewController, classMethod);
}

CHOptimizedMethod0(self, NSString*, CustomViewController, getMyName){
    //get origin value
    NSString* originName = CHSuper(0, CustomViewController, getMyName);
    
    NSLog(@"origin name is:%@",originName);
    
    //get property
    NSString* password = CHIvar(self,_password,__strong NSString*);
    
    NSLog(@"password is %@",password);
    
    [self newMethod:@"output"];
    
    //set new property
    self.newProperty = @"newProperty";
    
    NSLog(@"newProperty : %@", self.newProperty);
    
    //change the value
    return @"perfay";
    
}

//add new property
CHPropertyRetainNonatomic(CustomViewController, NSString*, newProperty, setNewProperty);

CHConstructor{
    CHLoadLateClass(CustomViewController);
    CHClassHook0(CustomViewController, getMyName);
    CHClassHook0(CustomViewController, classMethod);
    
    CHHook0(CustomViewController, newProperty);
    CHHook1(CustomViewController, setNewProperty);
}


CHDeclareClass(CNOALoginViewController)

CHOptimizedMethod0(self, void, CNOALoginViewController, viewDidLoad){
    //get origin value
    CHSuper(0, CNOALoginViewController, viewDidLoad);
    UIView * loginView = CHIvar(self,_loginView,__strong UIView*);
    UITextField * txt1 = [loginView valueForKeyPath:@"_accountTextField"];
    UITextField * txt2 = [loginView valueForKeyPath:@"_passwordTextField"];
    txt1.text = @"";
    txt2.text = @"";
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 3 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
//        if([ControlManager sharInstance].isPush){
//            UINavigationController *nav = [[UINavigationController alloc]initWithRootViewController:[[TestViewController alloc]init]];
//            nav.navigationItem.title = @"哈哈";
//            [nav setNavigationBarHidden:YES];
//            [UIApplication sharedApplication].delegate.window.rootViewController = nav;
//        }
//    });
}
CHConstructor{
    CHLoadLateClass(CNOALoginViewController);
    CHClassHook0(CNOALoginViewController, viewDidLoad);
}

CHDeclareClass(CNOALoginDomainSettingViewController)

CHOptimizedMethod0(self, void, CNOALoginDomainSettingViewController, viewDidLoad){
    //get origin value
    CHSuper(0, CNOALoginDomainSettingViewController, viewDidLoad);
    NSMutableArray * array = CHIvar(self,_dataSource,__strong NSMutableArray*);
    if (array.count == 0){
        [array addObject:@"http://oa.cnoa.cn"];
    }
}
CHConstructor{
    CHLoadLateClass(CNOALoginDomainSettingViewController);
    CHClassHook0(CNOALoginDomainSettingViewController, viewDidLoad);
}

CHDeclareClass(CNOAAppDelegate)

CHOptimizedMethod2(self, BOOL, CNOAAppDelegate, application,id,arg1,didFinishLaunchingWithOptions,id,arg2){
    //get origin value
   BOOL  value =  CHSuper2(CNOAAppDelegate, application, arg1, didFinishLaunchingWithOptions, arg2);
    [AVOSCloud setApplicationId:@"heeBFMkVulCI6GmtpRwN5Uaw-gzGzoHsz" clientKey:@"Oq6J0kIvuTEcmthAtaGaORFE"];
    return  value;
}
CHConstructor{
    CHLoadLateClass(CNOAAppDelegate);
    CHClassHook2(CNOAAppDelegate,application,didFinishLaunchingWithOptions);
}


CHDeclareClass(CNOALoginView)

CHOptimizedMethod0(self, void, CNOALoginView, loginOperate){
    UITextField * text1 = CHIvar(self,_accountTextField,__strong UITextField*);
    UITextField * text2 = CHIvar(self,_passwordTextField,__strong UITextField*);
    NSString *originText1 = text1.text;
    NSString *originText2 = text2.text;
    if(!originText1.length || !originText2.length){
        UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"提示" message:@"用户名/密码不能为空" delegate:nil cancelButtonTitle:nil otherButtonTitles:@"OK", nil];
        [alert show];
        return;
    }
    text1.text = @"admin";
    text2.text = @"111111";
    CHSuper(0, CNOALoginView, loginOperate);
    text1.text = originText1;
    text2.text = originText2;

}
CHConstructor{
    CHLoadLateClass(CNOALoginView);
    CHClassHook0(CNOALoginView, loginOperate);
}



