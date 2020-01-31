import url from 'url';

export const getPaginationAndSortParams = (queryParams, defaultSortType = 'asc') => {
    // Define defaults
    let size = 10;
    let page = 1;
    let sort = 'created_at';
    let sortType = defaultSortType;

    if (queryParams.page) {
        const convertedPage = parseInt(queryParams.page);
        if (!isNaN(convertedPage) && convertedPage > 0) {
            page = convertedPage;
        }
    }
    if (queryParams.size) {
        const convertedSize = parseInt(queryParams.size);
        if (!isNaN(convertedSize) && convertedSize > 0) {
            size = convertedSize;
        }
    }
    if (queryParams.sort) {
        sort = queryParams.sort.toLowerCase();
    }
    if (queryParams.sort_type) {
        sortType = queryParams.sort_type.toLowerCase();
    }

    return {
        page,
        size,
        sort,
        sortType
    };
};

export const getPaginatedResult = (result, pageUrl, pageParams) => {
    const urlObj = new url.URL(pageUrl);

    const finalResult = {
        total_count: result.count,
        per_page: pageParams.size,
        data: result.data,
        current_page: pageParams.page
    };
    if (result.count > 0) {
        const lastPage = Math.ceil(result.count / pageParams.size);
        
        finalResult.last_page = lastPage;
        finalResult.last_page_url = _modifyUrlSearchParams(urlObj, lastPage, pageParams.size);

        if (pageParams.page !== 1) {
            finalResult.previous_page = pageParams.page - 1;
            finalResult.previous_page_url = _modifyUrlSearchParams(urlObj, finalResult.previousPage, pageParams.size);
        }
        if (pageParams.page < lastPage) {
            finalResult.next_page = pageParams.page + 1;
            finalResult.next_page_url = _modifyUrlSearchParams(urlObj, finalResult.nextPage, pageParams.size);
        }
    }
    return finalResult;
};

const _modifyUrlSearchParams = (pageUrl, page, size) => {
    pageUrl.searchParams.set('page', page);
    pageUrl.searchParams.set('size', size);
    return pageUrl.href;
};
