import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";

/**@import "./banner.scss" */
@Component("banner")
export class BannerModule extends BaseComponent<BannerParams[]>{
	_currentIndex: number;
    onRendered(): void {
		this._currentIndex = 0;
		let height = document.documentElement.clientHeight;
		this.elem.style.height = height + 'px';

		this.$elem.find('.slider_content').css({
			width: this.params.length * 100 + '%'
		})
	}
    protected Render(): VNode {
        return (
            <div className="slider_container">
				<div className="slider_content"
				>
					{
						this.params.map((item) => {
							const bannerImg = {
								background: `url(${item}) center center / cover`
							};
							return(
								<div className="slider_url">
									<div className="slider_each" style={bannerImg}></div>
								</div>
							)
						})
					}
				</div>
				{
					<div className="slider_nav">
					{
						this.params.map((item, index) => {
							return(
								<span
									className={'slider_dot ' + (index == 0 ? 'selected' : '')}
								>
								</span>
							)
						})
					}
				</div>
				}
			</div>
        );
    }
}
export interface BannerParams{
}