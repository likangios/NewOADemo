//
//  TestViewController.m
//  NewOADemoDylib
//
//  Created by perfay on 2018/9/3.
//  Copyright © 2018年 luck. All rights reserved.
//

#import "TestViewController.h"

@interface TestViewController ()
@property(nonatomic,strong) UIImageView *backgroundImageView;

@end

@implementation TestViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor grayColor];
    _backgroundImageView = [[UIImageView alloc]initWithFrame:UIScreen.mainScreen.bounds];
    [self.view addSubview:_backgroundImageView];
    _backgroundImageView.image = [UIImage imageNamed:@"defaulIcon"];
}
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    exit(0);
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
