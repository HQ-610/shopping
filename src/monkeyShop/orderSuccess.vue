<template>
	<div>
		<header-nav></header-nav>
		<div class="container">
			<div class="page-title-normal">
				<h2 class="page-title-h2"><span>check out</span></h2>
			</div>
			<!-- 进度条 -->
			<div class="check-step">
				<ul>
					<li class="cur"><span>Confirm</span> address</li>
					<li class="cur"><span>View your</span> order</li>
					<li class="cur"><span>Make</span> payment</li>
					<li class="cur"><span>Order</span> confirmation</li>
				</ul>
			</div>

			<div class="order-create">
				<div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
				<div class="order-create-main">
					<h3>Congratulations! <br>Your order is under processing!</h3>
					<p>
						<span>Order ID：{{orderId}}</span>
						<span>Order total：{{orderTotal}}</span>
					</p>
					<div class="order-create-btn-wrap">
						<div class="btn-l-wrap">
							<router-link class="btn btn--m" to="/carts">Cart List</router-link>
						</div>
						<div class="btn-r-wrap">
							<router-link class="btn btn--m" to="/">Goods List</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
		<footer-nav></footer-nav>
	</div>
</template>

<script>
	import headerNav from "@/components/headerNav"
	import footerNav from "@/components/footerNav"
	import breadNav from "@/components/breadNav"

	import axios from "axios"
	export default {
		data() {
			return {
				orderId:this.$route.query.orderId,
				orderTotal:this.$route.query.orderTotal
			}
		},
		components: {
			headerNav,
			footerNav,
			breadNav
		}
	}
</script>

<style>

</style>