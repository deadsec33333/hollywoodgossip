function InfiniteScrollPagination( TRIGGER_WRAPPER, POSTS_WRAPPER ) {
	let triggerSelector = TRIGGER_WRAPPER + " a.next.page-numbers";
	let trigger         = document.querySelector( triggerSelector );
	let observer        = new IntersectionObserver(function (entries) {
		if ( entries[0].isIntersecting ) {
			entries[0].target.click();
		}
	});

	function attachHandlers() {
		if ( trigger ) {
			observer.observe( trigger );
			trigger.addEventListener( "click", load );
		}
	}
	attachHandlers();

	async function load( event ) {
		event.preventDefault();
		let parentNav = event.target.parentNode.parentNode;
		let url       = event.target.href;

		if (parentNav.classList.contains( "pagination" ) ) {
			parentNav.remove();
		} else {
			event.target.parentNode.removeChild( event.target );
		}

		try {
			let currentPosts      = document.querySelector( POSTS_WRAPPER );
			let fetched           = await fetch( url );
			let data              = await fetched.text();
			let results           = document.createElement( "div" );
			results.innerHTML     = data;
			let foundPosts        = results.querySelector( POSTS_WRAPPER );
			let foundPostsImages  = foundPosts.querySelectorAll(
				".article.excerpt img, .featured-image-container img, .wp-block-image img, .wp-block-gallery ul li figure img, .mvt-featured-post-block img"
			);
			let resultsPagination = results.querySelector( ".pagination" );
			trigger               = results.querySelector( triggerSelector );

			foundPostsImages.forEach((postImage) => {
				let dataSrc = postImage.getAttribute("data-pin-media");
				if (dataSrc == null) {
					dataSrc = postImage.getAttribute("src");
				}
				postImage.setAttribute( "src", dataSrc );
			});

			if ( resultsPagination ) {
				resultsPagination.remove();
			}

			if ( foundPosts && currentPosts ) {
				while ( foundPosts.children.length > 0 ) {
					currentPosts.append( foundPosts.children[0] );
				}
			}

			if ( trigger ) {
				currentPosts.append( trigger );
				attachHandlers();
			}

			parse_lyTrackingFunc( url, window.location.href );

			history.pushState( {}, "", url );

			if ( window.dataLayer ) {
				setTimeout(function(){
					dataLayer.push({
						'event': 'pageview',
						'page_path': window.location.pathname + 'scrolled/',
					});
				}, 3000);
			}

		} catch ( e ) {
			window.location.href = url;
		}
	}
	function disableInfiniteScroll() {
		if (observer) {
			observer.disconnect();
		}
		if (trigger) {
			trigger.removeEventListener("click", load);
			trigger.style.position   = 'static';
			trigger.style.visibility = 'visible';

			if (trigger.parentNode.parentNode.className.includes('pagination')) {
				trigger.parentNode.parentNode.style.position   = 'static';
				trigger.parentNode.parentNode.style.visibility = 'visible';
				trigger.parentNode.parentNode.style.gridColumn = '1 / -1';
				trigger.parentNode.parentNode.style.textAlign  = 'center';
			} else {
				trigger.style.gridColumn = '1 / -1';
				trigger.style.textAlign  = 'center';
			}
	
			const pageNumbers = trigger.parentNode.querySelectorAll('.page-numbers');
			pageNumbers.forEach(pageNumber => {
				if (!pageNumber.className.includes('prev') && !pageNumber.className.includes('next')) {
					pageNumber.style.display = 'none';
				}
			});
		}
	}
	document.addEventListener('disableInfiniteScrollEvent', function(e) {
		disableInfiniteScroll();
	});
}
InfiniteScrollPagination( ".nav-links", ".excerpt-wrapper" );

async function InfiniteScrollPostNav( TRIGGER_WRAPPER, POSTS_WRAPPER, TRIGGER_SELECTOR ) {
	let triggerSelector = TRIGGER_WRAPPER + TRIGGER_SELECTOR;
	let trigger         = document.querySelector( triggerSelector );
	let observer
	if ( null === trigger ) {
		trigger = document.querySelector( ".nav-previous" + TRIGGER_SELECTOR );
	}
	if ( null !== trigger) {
		observer = new IntersectionObserver( function (entries) {
			if ( entries[0].isIntersecting ) {
				entries[0].target.click();
			}
		});

		let currentPosts        = document.querySelector( POSTS_WRAPPER );
		let thisArticle         = currentPosts.querySelector( "article.article-post" );
		let thisPostIdAttr      = thisArticle.id;
		let thisPostID          = thisPostIdAttr.match( /\d*$/ )[0];
		let previousPosts       = [ thisPostID ];
		let relatedPostsResults = await fetchRelatedPosts( previousPosts );
		previousPosts           = relatedPostsResults.excluded_URLs;
		let relatedPostsQueue   =  relatedPostsResults.related_post_URLs;
		trigger.href            = relatedPostsQueue.shift();
	
		function attachHandlers() {
			if ( trigger ) {
				observer.observe( trigger );
				trigger.addEventListener( "click", load );
			}
		}
		attachHandlers();
	
		async function load( event ) {
			event.preventDefault();
	
			let parentNav = event.target.closest( ".post-navigation" ) || event.target.closest( TRIGGER_WRAPPER );
			let url       = event.target.href;
	
			if ( parentNav ) {
				parentNav.remove();
			}
	
			try {
				
				let fetched           = await fetch( url );
				let data              = await fetched.text();
				let results           = document.createElement( "div" );
				results.innerHTML     = data;
				let foundPost         = results.querySelector( POSTS_WRAPPER );
				let foundPostImages   = foundPost.querySelectorAll(
					".article.excerpt img, .featured-image-container img, .wp-block-image img, .wp-block-gallery ul li figure img, .mvt-featured-post-block img"
				);
				let foundPostTitle   = foundPost.querySelector( ".article-heading" );
				foundPostTitle = foundPostTitle.textContent.trim();
				let resultsPagination = results.querySelector( ".post-navigation" );
				let newTriggerWrapper = document.createElement( "div" );

				foundPostImages.forEach( ( postImage ) => {
					let dataSrc = postImage.getAttribute("data-pin-media");
					if (dataSrc == null) {
           				dataSrc = postImage.getAttribute("src");
          			}
					postImage.setAttribute( "src", dataSrc );
				});
	
				if ( relatedPostsQueue.length < 3 ) {
					relatedPostsResults = await fetchRelatedPosts( previousPosts );
					previousPosts       =  relatedPostsResults.excluded_URLs;
					relatedPostsQueue   =  relatedPostsQueue.concat( relatedPostsResults.related_post_URLs );
					if ( relatedPostsQueue.length < 3 ) {
						previousPosts = [ thisPostID ];
					}
				}
	
				newTriggerWrapper.className += ' nav-next';
				trigger                      = document.createElement( 'a' );
				trigger.href                 = relatedPostsQueue.shift();
				newTriggerWrapper.append( trigger );
	
				if ( resultsPagination ) {
					resultsPagination.remove();
				}
	
				if ( newTriggerWrapper && trigger ) {
					foundPost.children[0].append( newTriggerWrapper );
					attachHandlers();
				}
	
				if ( foundPost && currentPosts ) {
					currentPosts.append( foundPost.children[0] );
				}
	
				parse_lyTrackingFunc( url, window.location.href );

				history.pushState( {}, "", url );

				if ( window.dataLayer ) {
					setTimeout(function(){
						dataLayer.push({
							'event': 'pageview',
							'page_path': window.location.pathname + 'scrolled/',
							'title': foundPostTitle + ' - The Hollywood Gossip'
						});
					}, 3000);
				}

			} catch (error) {
				window.location.href = url;
			}
		}
	
		async function fetchRelatedPosts( excludePosts ) {

			let trellisInfinityURL = constants.trellisInfinityURL;
			let fetchURL          =  trellisInfinityURL + "public/get-related-post.php";
			let searchParams      = new URLSearchParams();
			searchParams.set( 'previous_post_ids', excludePosts);
			fetchURL              = fetchURL + '?' + searchParams.toString();
			let resultRelatedPost = await fetch( fetchURL );
			let relatedPostsData  = await resultRelatedPost.text();
	
			return JSON.parse( relatedPostsData );
		}
	}
	function disableInfiniteScroll() {
		if (observer) {
			observer.disconnect();
		}
		if (trigger) {
			trigger.removeEventListener("click", load);
		}
	}
	document.addEventListener('disableInfiniteScrollEvent', function(e) {
		disableInfiniteScroll();
	});
}
InfiniteScrollPostNav( ".nav-next", "#content", " a:not(.post-thumbnail)" );

function parse_lyTrackingFunc( url, urlRef ) {

	if ( window.PARSELY ) {

		PARSELY.beacon.trackPageView({
			url: url + '?scrolled=true',
			urlref: urlRef,
			js: 1
		});
	} else if ( url.includes( 'www.thehollywoodgossip.com' ) ) {
		setTimeout( parse_lyTrackingFunc( url, urlRef ), 3000 );
	}

	return true;
}
