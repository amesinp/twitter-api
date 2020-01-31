import url from 'url';

class TimelineController {
    constructor ({ tweetRepository, followMapRepository }) {
        this.tweetRepository = tweetRepository;
        this.followMapRepository = followMapRepository;
    }

    async retrieveTimelinePaginated (req, res) {
        let size = 10;
        let page = 1;

        if (req.query.page && !isNaN(parseInt(req.query.page))) {
            page = parseInt(req.query.page);
        }

        if (req.query.size && !isNaN(parseInt(req.query.size))) {
            size = parseInt(req.query.size);
        }

        const userFollows = await this.followMapRepository.getUserFollows(req.authUser._id);
        if (userFollows.length === 0) {
            return res.status(400).send({ message: 'Follow users to populate timeline' });
        }

        const result = await this.tweetRepository.getTweetsForUsersPaginated(userFollows, size, page);
        const lastRecord = page * size;

        // Get full url from request
        const pageURL = new url.URL(req.protocol + '://' + req.get('host') + req.originalUrl);

        const finalResult = {
            totalCount: result.count,
            tweets: result.tweets,
            currentPage: page,
            pageSize: size
        };
        if (lastRecord < result.count) {
            finalResult.nextPage = page + 1;
            finalResult.nextPageUrl = this._modifyUrlSearchParams(pageURL, finalResult.nextPage, size);
        }
        if (page !== 1) {
            finalResult.previousPage = page - 1;
            finalResult.previousPageUrl = this._modifyUrlSearchParams(pageURL, finalResult.previousPage, size);
        }

        return res.status(200).send(finalResult);
    }

    _modifyUrlSearchParams (pageUrl, page, size) {
        pageUrl.searchParams.set('page', page);
        pageUrl.searchParams.set('size', size);
        return pageUrl.href;
    }
}

export default TimelineController;
