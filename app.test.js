const request = require("supertest");
const app = require("./app");

describe('POST /songs', () => {
    it('should fetch songs based on primary filters, perform sorting & pagination', async () => {
        const response = await request(app)
            .post('/api/v1/songs')
            .send({
                "sortBy": "Year",
                "order": "DESC",
                "limit": 10,
                "offset": 10,
            })
            .expect(200)
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('data');
        expect(response.body.data[0]).toHaveProperty('Song');
        expect(response.body.data[0]).toHaveProperty('Artist');
        expect(response.body.data[0]).toHaveProperty('Year');
        expect(response.body.data[0]["Song"]).toEqual("The Last Great American Dynasty");
    });

    it('should fetch best album for June', async () => {
        const response = await request(app)
            .post('/api/v1/songs')
            .send({
                "operation": "monthlyPlays",
                "month": "june",
            })
            .expect(200)
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('data');
        expect(response.body.data[0]).toHaveProperty('Song');
        expect(response.body.data[0]).toHaveProperty('monthly_plays');
    });

    it('should fetch most popular song by August month ', async () => {
        const response = await request(app)
            .post('/api/v1/songs')
            .send({
                "operation": "mostPopularByMonth",
                "month": "August",
            })
            .expect(200)
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0]["Song"]).toEqual("Fifteen");
        expect(response.body.data[0]["monthly_plays"]).toEqual(99);
    });

    it('should fetch most popular song overall', async () => {
        const response = await request(app)
            .post('/api/v1/songs')
            .send({
                "operation": "mostPopularOverall",
            })
            .expect(200)
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0]["Song"]).toEqual("Style");
        expect(response.body.data[0]["Writer"]).toEqual("Taylor Swift Max Martin Shellback Ali Payami");
    });

    it('should fetch play count for months june and august for Song- "The 1"', async () => {
        const response = await request(app)
            .post('/api/v1/songs')
            .send({
                "song": "The 1",
                "operation": "compareMonths",
                "month": "june",
                "month2": "august",
            })
            .expect(200)
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0]["Song"]).toEqual("The 1");
        expect(response.body.data[0]["june_plays"]).toEqual(68);
        expect(response.body.data[0]["august_plays"]).toEqual(61);
    });

    it('should fetch play count of songs for month july with play count over 109', async () => {
        const response = await request(app)
            .post('/api/v1/songs')
            .send({
                "operation": "playsOverByMonth",
                "month": "july",
                "playsOver": 109,
                "limit": 10
            })
            .expect(200)
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toEqual(4);
        expect(response.body.data[0]["Song"]).toEqual("Better than Revenge");
        expect(response.body.data[0]["Plays-June"]).toEqual("5");
        expect(response.body.data[0]["Plays-July"]).toEqual("110");
        expect(response.body.data[0]["Plays-August"]).toEqual("71 ");
    });

    it('should fetch play count of songs overall with play count over 309', async () => {
        const response = await request(app)
            .post('/api/v1/songs')
            .send({
                "operation": "playsOverByOverall",
                "playsOver": 300,
                "limit": 10
            })
            .expect(200)
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toEqual(2);
        expect(response.body.data[0]["Song"]).toEqual("Beautiful Ghosts");
        expect(response.body.data[0]["Plays-June"]).toEqual("100");
        expect(response.body.data[0]["Plays-July"]).toEqual("106");
        expect(response.body.data[0]["Plays-August"]).toEqual("100 ");
    });

    it('should get HTTP Status code - 404 NotFound for invalid song not found', async () => {
        const response = await request(app)
            .post('/api/v1/songs')
            .send({
                "song": "invalid_song",
            })
            .expect(404)
    });

    it('should get HTTP Status code - 500 Internal Server Error for invalid query', async () => {
        const response = await request(app)
            .post('/api/v1/songs')
            .send({
                "sortBy": "invalid_column",
            })
            .expect(500)
    });
});
