<template>
	<el-container>
			<el-image :src="topImg"></el-image>
		<el-main>
			<el-form :label-position="labelPosition" label-width="80px" :model="loginForm">
				<div class="form">
					<div id="title">登录</div>
					<el-form-item label="用户名" style="margin-bottom: 0px;">
						<el-input ref="user" class="inputstyle" v-model="loginForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码" style="margin-bottom: 0px;">
						<el-input type="password" ref="password" class="inputstyle" v-model="loginForm.password"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<el-button type="warning" round @click="login">确定登录</el-button>
		</el-main>
<!--		<transition name="el-zoom-in-bottom">-->
			<!-- <el-button :plain="true"></el-button> -->
<!--		</transition>-->
	</el-container>
</template>

<script>
	import Vue from 'vue';
	import { Input,Button,CollapseTransition,Message } from 'element-ui';
	import topimg from '../../assets/img/init/init_logo.png';
	import api from "../../assets/js/api";
  import { Toast } from 'vant';
  Vue.use(Toast);
	Vue.component(Button.name, Button);
	Vue.component(Input.name, Input);
	Vue.component(CollapseTransition.name, CollapseTransition);
	Vue.component(Message.name, Message);
	export default{
		name: 'login',
		data () {
			return {
				labelPosition: 'top',
				topImg : topimg,
				isFail_msg : true,
				loginForm: {
					username: '',
					password: ''
				}
			}
		},
		methods: {
			async login (){
				var username = this.$refs.user.value
				var password = this.$refs.password.value
				if (document.getElementsByClassName('el-message').length === 0) {
					if (!username){
						this.$message({
						  message: '账号不能为空',
						  type: 'warning',
						  center: true,
						});
					}else if(!password){
						this.$message({
						  message: '请输入密码',
						  type: 'warning',
						  center: true,
						});
					}else{
            // console.log(process.env.VUE_APP_API_ROOT);return;
            const status = await api.login({
              username: username,
              password: password,
              group: 'app',
              device: 1
            })
            if (status.code === 200){
              Toast('登陆成功');
              let set = await api.settings()
              sessionStorage.setItem('token', status.data.access_token);
              sessionStorage.setItem('settings', JSON.stringify(set.data));
              sessionStorage.setItem('myInfo', JSON.stringify(status.data.member));
              this.$router.push('/index');
              // this.$router.go(0);
            }else{
              this.$message({
                message: '账号或密码不正确，请重新输入',
                type: 'warning',
                center: true,
              });
            }
          }
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.el-form-item {
		float: left;
		width: 100%;
		margin: 15px 0 0 0;
		padding: unset;
		color: #a5a5a5;
	}
	.inputstyle input.el-input__inner {
		border-top-width: 0px;
		border-left-width: 0px;
		border-right-width: 0px;
		border-bottom-width: 1px;
	}
	/deep/.el-button {
		width: 220px;
		background: #f79525;
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
		font-size: 13px;
		font-family: "microsoft yahei";
	}
	/deep/.el-form {
		width: 90%;
		height: 240px;
		box-shadow: 0 0 45px 15px rgba(0, 0, 0, 0.05);
		border-radius: 8px;
		padding: 20px 15px 20px 15px;
		text-align: left;
		vertical-align: middle;
		display: inline-block;
		background-color: #FFFFFF;
		margin: 40px 0 40px 0;
	}
	#title {
		font-size: 23px;
	}
	/deep/.el-main {
		width: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		-o-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		z-index: 999;
	}
	.el-image {
		z-index: 10;
	}
	// .transition-box {
	// margin-bottom: 10px;
	// width: 200px;
	// height: 100px;
	// border-radius: 4px;
	// background-color: #409EFF;
	// text-align: center;
	// color: #fff;
	// padding: 40px 20px;
	// box-sizing: border-box;
	// margin-right: 20px;
	// }
</style>
