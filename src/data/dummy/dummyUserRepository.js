import moment from 'moment';

class DummyUserRepository {
    constructor () {
        this.users = [
            {
                _id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
                username: 'johndoe',
                password: '$2b$08$bQPN9kxBgEV4SY.Gw7SP6eOWwGxOo6bx80g9KBHsTJLhrn8I0mklu', // hash equivalent of "password"
                created_at: '2020-01-10T23:36:58.963Z'
            },
            {
                _id: 2,
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                username: 'janedoe',
                password: '$2b$08$bQPN9kxBgEV4SY.Gw7SP6eOWwGxOo6bx80g9KBHsTJLhrn8I0mklu', // hash equivalent of "password"
                created_at: '2020-01-11T13:36:58.963Z'
            },
            {
                _id: 3,
                name: 'John Smith',
                email: 'johnsmith@example.com',
                username: 'johnsmith',
                password: '$2b$08$bQPN9kxBgEV4SY.Gw7SP6eOWwGxOo6bx80g9KBHsTJLhrn8I0mklu', // hash equivalent of "password"
                created_at: '2020-01-20T23:36:58.963Z'
            },
            {
                _id: 4,
                name: 'Jane Smith',
                email: 'janesmith@example.com',
                username: 'janesmith',
                password: '$2b$08$bQPN9kxBgEV4SY.Gw7SP6eOWwGxOo6bx80g9KBHsTJLhrn8I0mklu', // hash equivalent of "password"
                created_at: '2020-01-30T23:36:58.963Z'
            }
        ];
    }

    async getByUsernameOrEmail (user) {
        return this.users.find(u => u.email === user.username || u.username === user.username);
    }

    async checkUsernameExists (username) {
        const user = this.users.find(u => u.username === username);
        return user != null;
    }

    async checkEmailExists (email) {
        const user = this.users.find(u => u.email === email);
        return user != null;
    }

    async getById (id) {
        const convertedId = parseInt(id);
        if (isNaN(convertedId)) {
            return null;
        }

        return this.users.find(u => u._id === convertedId);
    }

    async createUser (user) {
        let id = 1;
        if (this.users.length > 0) {
            id = parseInt(this.users[this.users.length - 1]._id) + 1;
        }
        user._id = id;
        this.users.push(user);
        return user;
    }

    async getUsersPaginated (searchParams, sortParam, sortType, pageSize, currentPage) {
        let filteredUsers = JSON.parse(JSON.stringify(this.users)); // So that changes don't affect original array
        let paginatedUsers = [];

        if (searchParams.username) {
            filteredUsers = filteredUsers.filter(t => t.username === searchParams.username);
        }

        if (searchParams.name) {
            filteredUsers = filteredUsers.filter(t => t.name === searchParams.name);
        }

        if (searchParams.search) {
            filteredUsers = filteredUsers.filter(t => t.username.indexOf(searchParams.search) > -1 || t.name.indexOf(searchParams.search) > -1);
        }

        if (searchParams.fromDate || searchParams.toDate) {
            if (searchParams.fromDate) {
                const parsedFromDate = moment(searchParams.fromDate);
                filteredUsers = filteredUsers.filter(t => moment(t.created_at) >= parsedFromDate);
            }
            if (searchParams.toDate) {
                const parsedToDate = moment(searchParams.toDate);
                filteredUsers = filteredUsers.filter(t => moment(t.created_at) <= parsedToDate);
            }
        }

        if (filteredUsers.length > 0) {
            const isDesc = sortType === 'desc';
            if (sortParam === 'created_at') {
                filteredUsers.sort((a, b) => {
                    const aDate = moment(a);
                    const bDate = moment(b);
                    if (isDesc) {
                        return bDate > aDate ? 1 : bDate < aDate ? -1 : 0;
                    } else {
                        return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
                    }
                });
            } else if (sortParam === 'name') {
                filteredUsers.sort((a, b) => {
                    if (isDesc) {
                        return b.name > a.name ? 1 : b.name < a.name ? -1 : 0;
                    } else {
                        return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
                    }
                });
            } else if (sortParam === 'username') {
                filteredUsers.sort((a, b) => {
                    if (isDesc) {
                        return b.username > a.username ? 1 : b.username < a.username ? -1 : 0;
                    } else {
                        return a.username > b.username ? 1 : a.username < b.username ? -1 : 0;
                    }
                });
            }

            paginatedUsers = this._getUsersForPage(filteredUsers, pageSize, currentPage);
        }

        return {
            data: paginatedUsers,
            count: filteredUsers.length
        };
    }

    _getUsersForPage (filteredUsers, pageSize, currentPage) {
        const paginatedUsers = [];
        const offset = (pageSize * currentPage) - pageSize;

        if (offset < filteredUsers.length) {
            let lastIndex = offset + pageSize;
            lastIndex = lastIndex > filteredUsers.length ? filteredUsers.length : lastIndex;
            
            for (let i = offset; i < lastIndex; i++) {
                paginatedUsers.push(filteredUsers[i]);
            }
        }

        return paginatedUsers;
    }
}

export default DummyUserRepository;
