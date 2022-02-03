const paginate = document.getElementById('paginate');
const $campgroundsContainer = $('#campgrounds-container');
paginate.addEventListener('click', function(e) {
    e.preventDefault();
    fetch(this.href)
        .then(response => response.json())
        .then(data => {
            for (const campground of data.docs) {
                let template = generateCampground(campground);
                $campgroundsContainer.append(template);
            }
            let { nextPage } = data;
            this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
            campgrounds.features.push(...data.docs);
            map.getSource('campgrounds').setData(campgrounds);
        })
        .catch(err => console.log('ERROR', err))
})

function generateCampground(campground) {
    let template =
        `<div class="card mb-3">
        <div class="row">
            <div class="col-md-4">
                <img alt="" class="img-fluid" src="${ campground.images.length ? campground.images[0].url : 'https://res.cloudinary.com/dgtn6hfgp/image/upload/v1641934724/YelpCamp/pyksq7w0jct3rtnlyeea.jpg' }">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                <h5 class="card-title">
                    ${campground.title}
                </h5>
                <p class="card-text">
                    ${campground.description}
                </p>
                <p class="card-text">
                    <small class="text-muted">
                        ${campground.location}
                    </small>
                </p>
                <a href="/campgrounds/${campground._id}" class="btn btn-primary">Visit ${campground.title} </a>
            </div>
        </div>
    </div>
    </div>`
    return template;
}
