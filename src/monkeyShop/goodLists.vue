<template>
	<div>
		<header-nav></header-nav>
		<bread-nav>
			<span>goods</span>
		</bread-nav>
		<div class="accessory-result-page accessory-page">
			<div class="container">
				<div class="filter-nav">
					<span class="sortby">Sort by:</span>
					<a href="javascript:void(0)" class="default cur">Default</a>
					<a href="javascript:void(0)" class="price"  @click="sortGoods">Price</a>
					<a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
				</div>
				<div class="accessory-result">
					<!-- filter -->
					<div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
						<dl class="filter-price">
							<dt>Price:</dt>
							<dd @click="priceChecked = 'all',setPriceFilter(priceChecked)">
								<a href="javascript:void(0)" v-bind:class = "{'cur':priceChecked == 'all'}">All</a>
							</dd>
							<dd v-for="(item,index) in goodsPrice" @click="setPriceFilter(index)">
								<a href="javascript:void(0)" v-bind:class="{'cur':priceChecked == index}">{{item.start}} - {{item.endPrice}}</a>
							</dd>
						</dl>
					</div>

					<!-- search result accessories list -->
					<div class="accessory-list-wrap">
						<div class="accessory-list col-4">
							<ul>
								<li v-for="(item,index) in goodsList">
									<div class="pic">
										<a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{item.productName}}</div>
										<div class="price">{{item.salePrice}}</div>
										<div class="btn-area">
											<a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
										</div>
									</div>
								</li>
							</ul>
							<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" :class="{'load-more':loadEnd,loading:page}">
								<img src="static/loading-svg/loading-spinning-bubbles.svg" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="md-overlay" v-show="overLayPop" @click = "closePop"></div>
		<model v-bind:mdShow="mdShow" v-on:close="close"> 
			<p slot="message">
				请先登录！否则不能加入购物车！
			</p>
			<div slot="btnGroup">
				<a href="javascipt:;" class="btn btn--m" @click="mdShow=false">关闭</a>
			</div>
		</model>
		<model v-bind:mdShow="mdShowCart" v-on:close="close"> 
			<p slot="message">
				加入购物车成功！
			</p>
			<div slot="btnGroup">
				<a href="javascipt:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
				<router-link class="btn btn--m" to="/carts">去购物车</router-link>
			</div>
		</model>
		<footer-nav></footer-nav>
	</div>
</template>

<script>
	import "./css/base.css"
	import "./css/product.css"
	import "./css/login.css"
	import "./css/checkout.css"
	import headerNav from "@/components/headerNav"
	import footerNav from "@/components/footerNav"
	import breadNav from "@/components/breadNav"
	import model from "@/components/model"
	
	import axios from "axios"
	
	export default{
		data(){
			return {
				goodsList:[],
				sortFlag:true,
				page:1,
				pageSize:8,
				busy: true,
				loadEnd: false,
				mdShow:false,
				mdShowCart:false,
				goodsPrice:[
				{
					start:"0.00",
					endPrice:"100.00"
				},{
					start:"100.00",
					endPrice:"500.00"
				},{
					start:"500.00",
					endPrice:"1000.00"
				},{
					start:"1000.00",
					endPrice:"5000.00"
				}
				],
				priceChecked:"all",
				filterBy:false,
				overLayPop:false
			}
		},
		components:{
			headerNav,breadNav,footerNav,model
		},
		mounted:function(){
			this.GoodList();
		},
		methods:{
			GoodList:function(flag){
				var param = {
					page:this.page,
					pageSize:this.pageSize,
					sort:this.sortFlag?1:-1,
					priceChecked:this.priceChecked
				}
				axios.get("/goods/list",{
					params:param
				}).then((res)=>{
					let result = res.data;
					if(result.status == "0"){
						if(flag){
							this.goodsList = this.goodsList.concat(result.result.list);
							if(result.result.count == 0 ){
								this.busy = true;
								this.loadEnd = true;
							}else{
								this.busy = false;
							}
						}
						else{
							this.goodsList = result.result.list;
							this.busy = false;
						}
						
					}else{
						this.goodsList = [];
					}
					
				});
				
			},
			sortGoods:function(){
				this.sortFlag = ! this.sortFlag;
				this.page = 1;
				this.GoodList();
			},
			showFilterPop:function(){
				this.filterBy = true;
				this.overLayPop = true;
			},
			setPriceFilter(index){
				this.priceChecked = index;
				this.page = 1;
				this.GoodList();
				this.closePop()
			},
			closePop:function(){
				this.filterBy = false;
				this.overLayPop = false;
			},
			loadMore:function(){
				this.busy = true;
				setTimeout(() => {
					this.page++;
					this.GoodList(true);
				}, 500);
			},
			addCart:function(productId){
				axios.post("/goods/addCart",{
					productId:productId
				}).then((res)=>{
					if(res.data.status == '0'){
						this.mdShowCart = true
					}else{
						this.mdShow = true;
					}
				})
			},
			close:function(){
				this.mdShow = false;
			}
		}
	}
</script>
<style>
	.load-more {
		display: none;
	}
	
	.loading {
		text-align: center;
	}
</style>