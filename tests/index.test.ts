import 'dotenv/config';
import request from "supertest";
import { server } from "@/app";
import { database } from "@/app/repositories";
import { MySQLDatabase } from "@/infrastructure/database/MySQLDatabase";
import { DatabaseMigration } from "@/infrastructure/database/migrations/DatabaseMigration";
import Logger from "@/infrastructure/logger/Logger";
import { organization, privateEvent, user, user2, user2Credentials, userCredentials, event, jobpost, privateTeam, team, challenge, privateChallenge, testCases, organizationChallengesIds, eventChallengesIds, publicChallengesIds } from './test_data';

let access_token: string = "";
let user2_access_token: string = "";

describe("API Tests:", () => {
    afterAll(() => {
        database.close();
        server.close();
    });

    describe("Database migrations", () => {
        test("Create tables", async () => {
            const logger = new Logger();
            const databaseMigration = new DatabaseMigration(new MySQLDatabase(), logger);
            const spy = jest.spyOn(logger, "info");

            await databaseMigration.migrateAll();

            expect(spy).toHaveBeenCalledTimes(22);
        }, 30000);

        test("Drop tables", async () => {
            const logger = new Logger();
            const databaseMigration = new DatabaseMigration(new MySQLDatabase(), logger);
            const spy = jest.spyOn(logger, "info");

            await databaseMigration.dropAll();

            expect(spy).toHaveBeenCalledTimes(22);

            // IMPORTANT: This step is necessary to allow all other tests to work.
            await databaseMigration.migrateAll();
        }, 30000);
    });

    describe("Authentication", () => {
        test("Should return error list when invalid Sign Up form data is submitted", async () => {
            const response = await request(server).post("/api/auth/sign_up");

            const expectedOutput = {
                status: 'error',
                message: 'missing properties',
                errors: [
                    'username is missing',
                    'first_name is missing',
                    'last_name is missing',
                    'email is missing',
                    'password is missing'
                ]
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        test("Should create new user", async () => {
            const response = await request(server).post("/api/auth/sign_up").send(user);
            await request(server).post("/api/auth/sign_up").send(user2);

            const expectedOutput = {
                status: 'success',
                data: {
                    fieldCount: 0,
                    affectedRows: 1,
                    insertId: 1,
                    info: '',
                    serverStatus: 2,
                    warningStatus: 0,
                    changedRows: 0
                }
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        test("Should return error list when invalid Sign In form data is submitted", async () => {
            const response = await request(server).post("/api/auth/sign_in");

            const expectedOutput = {
                status: 'error',
                message: 'missing properties',
                errors: [
                    'email is missing',
                    'password is missing'
                ]
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        test("Should return a user session", async () => {
            const response = await request(server).post("/api/auth/sign_in").send(userCredentials);
            const response1 = await request(server).post("/api/auth/sign_in").send(user2Credentials);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(response.body.data.access_token).toBeDefined();

            access_token = response.body.data.access_token;
            user2_access_token = response1.body.data.access_token;
        });

        test("Should return a invalid session when user sign out", async () => {
            const response = await request(server).post("/api/auth/sign_in").send(userCredentials);
            const response1 = await request(server).post("/api/auth/sign_out").set('Authorization', response.body.data.access_token);

            console.log({ access_token, response1: response.body.data.access_token });

            expect(response1.statusCode).toBe(200);
            expect(response1.body.status).toEqual("success");
            expect(response1.body.message).toEqual("Sign out success");

            const response2 = await request(server).get("/api/users/me").set('Authorization', response.body.data.access_token);

            expect(response2.statusCode).toBe(200);
            expect(response2.body.status).toEqual("error");
            expect(response2.body.message).toEqual("Invalid session");
        });

        test("Should return an error for unauthorized access to a protected route", async () => {
            const response = await request(server).post("/api/organizations/create");

            const expectedOutput = {
                status: 'error',
                message: 'missing Authorization Header',
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });
    });

    describe("User Management", () => {
        test("Should retrieve the current user of the session", async () => {
            const response = await request(server).get("/api/users/me").set('Authorization', access_token);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(response.body.data.username).toEqual(user.username);
        });

        test("Should retrieve a user with ID '1'", async () => {
            const response = await request(server).get("/api/users/1");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(response.body.data.id).toEqual(1);
        });

        test("Should return an error when user does not exist", async () => {
            const response = await request(server).get("/api/users/99");

            const expectedOutput = {
                status: 'error',
                message: "User not found"
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        test("Should not update username to an existing one", async () => {
            const response = await request(server).post("/api/users/me").set('Authorization', access_token).send({ username: 'user2' });

            const expectedOutput = {
                status: 'error',
                message: "username already in use"
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        test("Should not update email to an existing one", async () => {
            const response = await request(server).post("/api/users/me").set('Authorization', access_token).send({ email: 'user2@jest.com' });

            const expectedOutput = {
                status: 'error',
                message: "email already in use"
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        test("Should successfully update user information", async () => {
            const response = await request(server).post("/api/users/me").set('Authorization', access_token).send({ first_name: "test_user" });

            const expectedOutput = { status: "success", message: "User updated successfully" };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });
    });

    describe("Organizations", () => {
        test("Should return error list when invalid 'Create Organization' form data is submitted", async () => {
            const response = await request(server).post("/api/organizations/create").set('Authorization', access_token);

            const expectedOutput = {
                status: 'error',
                message: 'Invalid body parameters',
                errors: [
                    "name is missing",
                    "type is missing",
                ]
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        test("Should create new organization", async () => {
            const response = await request(server).post("/api/organizations/create").set('Authorization', access_token).send(organization);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('id');
        });

        test("Should list organizations", async () => {
            const response = await request(server).get("/api/organizations");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(Array.isArray(response.body.data)).toBeTruthy();
        });

        test("Should successfully retrieve an organization with ID '1'", async () => {
            const response = await request(server).get("/api/organizations/1");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(response.body.data.id).toEqual(1);
        });

        test("Should return an error when an organization with a specified ID is not found", async () => {
            const response = await request(server).get("/api/organizations/2");

            const expectedOutput = {
                status: "error",
                message: "Organization not found"
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        describe("Organization Update", () => {
            test("Should not update non-existing organization", async () => {
                const response = await request(server).post("/api/organizations/99/update").set('Authorization', access_token).send({ name: "New Name" });

                const expectedOutput = {
                    status: "error",
                    message: "Organization not found"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should not update organization without proper permissions", async () => {
                const response = await request(server).post("/api/organizations/1/update").set('Authorization', user2_access_token).send({ name: "New Name" });

                const expectedOutput = {
                    status: "error",
                    message: "You don't have permissions"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should update job post successfully", async () => {
                const response = await request(server).post("/api/organizations/1/update").set('Authorization', access_token).send({ name: "New Name" });
                const response1 = await request(server).get("/api/organizations/1");

                const expectedOutput = {
                    status: "success",
                    message: "Organization updated successfully"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
                expect(response1.body.data.name).toEqual("New Name");
            });
        });

        describe("Organization Job Posts and Job Applications", () => {
            test("Should list organization job posts", async () => {
                const response = await request(server).get("/api/organizations/1/job_posts");

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(Array.isArray(response.body.data)).toBeTruthy();
            });

            test("Should not list organization job post applications without proper permissions", async () => {
                const response = await request(server).get("/api/organizations/1/job_posts/1/applications").set('Authorization', user2_access_token);

                const expectedOutput = { status: "error", message: "You don't have permissions" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should list organization job post applications", async () => {
                const response = await request(server).get("/api/organizations/1/job_posts/1/applications").set('Authorization', access_token);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(Array.isArray(response.body.data)).toBeTruthy();
            });
        });

        describe("Organization Challenges", () => {
            describe("Challenge Creation", () => {
                test("Should not create challenge when missing parameters", async () => {
                    const response = await request(server).post("/api/organizations/1/challenges/create").set("Authorization", access_token);

                    const expectedOutput = {
                        status: 'error',
                        message: 'Invalid body parameters',
                        errors: [
                            "is_public is missing",
                            "level is missing",
                            "title is missing",
                            "description is missing",
                            "topic is missing",
                            "type is missing",
                        ]
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not create challenge when organization does not exist", async () => {
                    const response = await request(server).post("/api/organizations/99/challenges/create").set("Authorization", access_token).send(challenge);

                    const expectedOutput = {
                        status: "error",
                        message: "Organization does not exist"
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not create challenge without proper permissions", async () => {
                    const response = await request(server).post("/api/organizations/1/challenges/create").set("Authorization", user2_access_token).send(challenge);

                    const expectedOutput = {
                        status: "error",
                        message: "You don't have permissions"
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should create challenge successfully", async () => {
                    const response = await request(server).post("/api/organizations/1/challenges/create").set("Authorization", access_token).send(challenge);
                    // TODO: Get the Id from response
                    organizationChallengesIds.push(1);
                    const expectedOutput = { status: "success", message: "Challenge created successfully" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });
            });

            test("Should list organization challenges", async () => {
                const response = await request(server).get("/api/organizations/1/challenges").set("Authorization", access_token);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(Array.isArray(response.body.data)).toBeTruthy();
            });
        });

        describe("Organization Members", () => {
            test("Should list organization members", async () => {
                const response = await request(server).get("/api/organizations/1/members").set("Authorization", access_token);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(Array.isArray(response.body.data)).toBeTruthy();
            });

            test("Should get organization member of the current user", async () => {
                const response = await request(server).get("/api/organizations/1/members/me").set("Authorization", access_token);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
            });
        });

        describe("Organization Events", () => {
            test("Should list organization events", async () => {
                const response = await request(server).get("/api/organizations/1/events").set("Authorization", access_token);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(Array.isArray(response.body.data)).toBeTruthy();
            });
        });

        test("Should get organization dashboard stats", async () => {
            const response = await request(server).get("/api/organizations/1/dashboard").set("Authorization", access_token);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
        });

        test("Should list user organizations", async () => {
            const response = await request(server).get("/api/organizations/me").set("Authorization", access_token);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(Array.isArray(response.body.data)).toBeTruthy();
        });
    });

    describe("JobPosts", () => {
        test("Should return error list when invalid 'Create JobPost' form data is submitted | POST /api/jobposts/create", async () => {
            const response = await request(server).post("/api/jobposts/create").set('Authorization', access_token);

            const expectedOutput = {
                status: 'error',
                message: 'Invalid body parameters',
                errors: [
                    "title is missing",
                    "description is missing",
                    "role is missing",
                    "type is missing",
                    "location is missing",
                    "contractType is missing",
                    "organization_id is missing",
                ]
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        test("Should create new jobpost | POST /api/jobposts/create", async () => {
            const response = await request(server).post("/api/jobposts/create").set('Authorization', access_token).send(jobpost);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual('success');
            expect(response.body.data).toHaveProperty('id');
        });

        test("Should list job posts | GET /api/jobposts", async () => {
            const response = await request(server).get("/api/jobposts");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(Array.isArray(response.body.data)).toBeTruthy();
        });

        test("Should successfully retrieve an job post with ID '1' | GET /api/jobposts/:id", async () => {
            const response = await request(server).get("/api/jobposts/1");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(response.body.data.id).toEqual(1);
        });

        test("Should return an error when an job post with a specified ID is not found | GET /api/jobposts/:id", async () => {
            const response = await request(server).get("/api/jobposts/2");

            const expectedOutput = {
                status: "error",
                message: "Job Post not found"
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        describe("Job Post Applications", () => {
            test("Should successfully apply to the job", async () => {
                const response = await request(server).post("/api/jobposts/1/apply").set('Authorization', access_token);

                const expectedOutput = {
                    status: "success",
                    message: "Job Application sent successfully"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });
            test("Should not allow multiple applications to the same job", async () => {
                const response = await request(server).post("/api/jobposts/1/apply").set('Authorization', access_token);

                const expectedOutput = {
                    status: "error",
                    message: "You already applied to that job"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });
        });

        describe("Job Post Update", () => {
            test("Should not update non-existing job post", async () => {
                const response = await request(server).post("/api/jobposts/99/update").set('Authorization', access_token).send({ title: "New Title" });

                const expectedOutput = {
                    status: "error",
                    message: "Job Post not found"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should not update job post without proper permissions", async () => {
                const response = await request(server).post("/api/jobposts/1/update").set('Authorization', user2_access_token).send({ title: "New Title" });

                const expectedOutput = {
                    status: "error",
                    message: "You don't have permissions"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should update job post successfully", async () => {
                const response = await request(server).post("/api/jobposts/1/update").set('Authorization', access_token).send({ title: "New Title" });
                const response1 = await request(server).get("/api/jobposts/1");

                const expectedOutput = {
                    status: "success",
                    message: "Job Post updated successfully"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
                expect(response1.body.data.title).toEqual("New Title");
            });
        });

        describe("Job Post Delete", () => {
            test("Should not delete non-existing job post", async () => {
                const response = await request(server).post("/api/jobposts/99/delete").set('Authorization', access_token);

                const expectedOutput = {
                    status: "error",
                    message: "Job Post not found"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should not delete job post without proper permissions", async () => {
                const response = await request(server).post("/api/jobposts/1/delete").set('Authorization', user2_access_token);

                const expectedOutput = {
                    status: "error",
                    message: "You don't have permissions"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should delete job post successfully", async () => {
                const response = await request(server).post("/api/jobposts/1/delete").set('Authorization', access_token);
                const response1 = await request(server).get("/api/jobposts/1");

                const expectedOutput = {
                    status: "success",
                    message: "Job Post deleted successfully"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
                expect(response1.body.message).toEqual("Job Post not found");
            });
        });
    });

    describe("Events", () => {
        test("Should return error list when invalid 'Create Event' form data is submitted", async () => {
            const response = await request(server).post("/api/events/create").set('Authorization', access_token);

            const expectedOutput = {
                status: 'error',
                message: 'Invalid body parameters',
                errors: [
                    "title is missing",
                    "description is missing",
                    "is_public is missing",
                    "start_at is missing",
                    "end_at is missing",
                    "organization_id is missing",
                    "is_team_based is missing",
                ]
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        test("Should create new event", async () => {
            const response = await request(server).post("/api/events/create").set('Authorization', access_token).send(event);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual('success');
            expect(response.body.data).toHaveProperty('id');
        });

        test("Should list events", async () => {
            const response = await request(server).get("/api/events");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(Array.isArray(response.body.data)).toBeTruthy();
        });

        test("Should successfully retrieve an event  with ID '1'", async () => {
            const response = await request(server).get("/api/events/1");

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(response.body.data.id).toEqual(1);
        });

        test("Should return an error when an event with a specified ID is not found", async () => {
            const response = await request(server).get("/api/events/2");

            const expectedOutput = {
                status: "error",
                message: "Event not found"
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expectedOutput);
        });

        describe("Event Update", () => {
            test("Should not update non-existing event", async () => {
                const response = await request(server).post("/api/events/99/update").set('Authorization', access_token).send({ title: "New Title" });

                const expectedOutput = {
                    status: "error",
                    message: "Event not found"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should not update event without proper permissions", async () => {
                const response = await request(server).post("/api/events/1/update").set('Authorization', user2_access_token).send({ title: "New Title" });

                const expectedOutput = {
                    status: "error",
                    message: "You don't have permissions"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should update event successfully", async () => {
                const response = await request(server).post("/api/events/1/update").set('Authorization', access_token).send({ title: "New Title" });

                const expectedOutput = {
                    status: "success",
                    message: "Event updated successfully"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });
        });

        describe("Join Event", () => {
            test("Should return an error when attempting to join a non-existent event", async () => {
                const response = await request(server).post("/api/events/2/join_event").set('Authorization', access_token);

                const expectedOutput = { status: "error", message: "Event does not exist" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should deny event join attempt with incorrect password", async () => {
                await request(server).post("/api/events/create").set('Authorization', access_token).send(privateEvent);
                const response = await request(server).post("/api/events/2/join_event").set('Authorization', user2_access_token).send({ password: 'wrong_password' });

                const expectedOutput = { status: "error", message: "Wrong Password" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should allow a user to successfully join a public event without a password", async () => {
                const response = await request(server).post("/api/events/1/join_event").set('Authorization', user2_access_token);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(response.body.message).toEqual("Successfully joined the event");
            });

            test("Should allow a user to successfully join an event with valid credentials", async () => {
                const response = await request(server).post("/api/events/2/join_event").set('Authorization', user2_access_token).send({ password: 'test' });

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(response.body.message).toEqual("Successfully joined the event");
            });

            test("Should prevent joining an event if the user is already a participant", async () => {
                const response = await request(server).post("/api/events/1/join_event").set('Authorization', user2_access_token);
                const expectedOutput = { status: "error", message: "You already joined" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });
        });

        describe("Leave Event", () => {
            test("Should successfully leave the event", async () => {
                const response = await request(server).post("/api/events/1/leave_event").set('Authorization', user2_access_token);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(response.body.message).toEqual("You have leaved the event successfully");
            });
        });

        describe("Teams", () => {
            describe("Team Creation", () => {
                test("Should not create a team if invalid 'Create Team' form is submitted", async () => {
                    const response = await request(server).post("/api/events/1/teams/create").set("Authorization", user2_access_token);

                    const expectedOutput = {
                        status: 'error',
                        message: 'Invalid body parameters',
                        errors: [
                            "name is missing",
                            "description is missing",
                            "is_private is missing"
                        ]
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not create a team if the event is not team based", async () => {
                    const response = await request(server).post("/api/events/2/teams/create").set("Authorization", user2_access_token).send(team);

                    const expectedOutput = { status: "error", message: "This event is not team based" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not create a team if not a participant in the event", async () => {
                    const response = await request(server).post("/api/events/1/teams/create").set("Authorization", user2_access_token).send(team);

                    const expectedOutput = { status: "error", message: "You need to join the event first" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should successfully create a team", async () => {
                    await request(server).post("/api/events/1/join_event").set("Authorization", user2_access_token);
                    const response = await request(server).post("/api/events/1/teams/create").set("Authorization", user2_access_token).send(team);

                    expect(response.statusCode).toBe(200);
                    expect(response.body.status).toEqual("success");
                    expect(response.body.message).toEqual("Team created successfully");
                });

                test("Should not create a team if already in a team", async () => {
                    const response = await request(server).post("/api/events/1/teams/create").set("Authorization", user2_access_token).send(team);

                    const expectedOutput = { status: "error", message: "You are already in a team" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });
            });

            describe("Teams fetch", () => {
                test("Should list event teams", async () => {
                    const response = await request(server).get("/api/events/1/teams");

                    expect(response.statusCode).toBe(200);
                    expect(response.body.status).toEqual("success");
                    expect(Array.isArray(response.body.data)).toBeTruthy();
                });

                test("Should return an error if the team is not found", async () => {
                    const response = await request(server).get("/api/events/1/teams/99");

                    const expectedOutput = {
                        status: 'error',
                        message: 'Team not found'
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should retrieve a specific team by its id (1)", async () => {
                    const response = await request(server).get("/api/events/1/teams/1");

                    expect(response.statusCode).toBe(200);
                    expect(response.body.status).toEqual("success");
                    expect(response.body.data.id).toEqual(1);
                });
            });

            describe("Team Update", () => {
                test("Should not update team when event does not exist", async () => {
                    const response = await request(server).post("/api/events/99/teams/1/update").set("Authorization", access_token).send({ name: "New Name" });

                    const expectedOutput = {
                        status: "error",
                        message: "Event not found"
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not update team without proper permissions", async () => {
                    const response = await request(server).post("/api/events/1/teams/1/update").set("Authorization", access_token).send({ name: "New Name" });

                    const expectedOutput = { status: "error", message: "You don't have permissions" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should update team successfully", async () => {
                    const response = await request(server).post("/api/events/1/teams/1/update").set("Authorization", user2_access_token).send({ name: "New Name" });
                    const response1 = await request(server).get("/api/events/1/teams/1").set("Authorization", user2_access_token);

                    const expectedOutput = { status: "success", message: "Team updated successfully" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                    expect(response1.body.data.name).toEqual("New Name");
                });
            });

            describe("Team Deletion", () => {
                test("Should not delete a team if not a participant on the event", async () => {
                    const response = await request(server).post("/api/events/1/teams/delete").set("Authorization", access_token).send({ team_id: 1 });

                    const expectedOutput = { status: "error", message: "You are not a participant in this event" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not delete a team if the team does not exist", async () => {
                    const response = await request(server).post("/api/events/1/teams/delete").set("Authorization", user2_access_token).send({ team_id: 5 });

                    const expectedOutput = { status: "error", message: "No Team Found" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });


                test("Should not delete a team if not the leader of the team", async () => {
                    await request(server).post("/api/events/1/join_event").set("Authorization", access_token);
                    const response = await request(server).post("/api/events/1/teams/delete").set("Authorization", access_token).send({ team_id: 1 });

                    const expectedOutput = { status: "error", message: "Only the leader can delete the team" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should successfully delete a team", async () => {
                    const response = await request(server).post("/api/events/1/teams/delete").set("Authorization", user2_access_token).send({ team_id: 1 });

                    const expectedOutput = { status: "success", message: "Team deleted successfuly" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });
            });

            describe("Team Join", () => {
                test("Should not join a team if not a participant in the event", async () => {
                    await request(server).post("/api/events/1/leave_event").set("Authorization", access_token);
                    const response = await request(server).post("/api/events/1/teams/join").set("Authorization", access_token).send({ team_id: 2 });

                    const expectedOutput = { status: "error", message: "You need to join the event first" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not join a team if already in a team", async () => {
                    await request(server).post("/api/events/1/join_event").set("Authorization", access_token);
                    await request(server).post("/api/events/1/teams/create").set("Authorization", access_token).send(team);
                    const response = await request(server).post("/api/events/1/teams/join").set("Authorization", access_token).send({ team_id: 1 });

                    const expectedOutput = { status: "error", message: "You already in a team" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not join a team if the team does not exist", async () => {
                    const response = await request(server).post("/api/events/1/teams/join").set("Authorization", user2_access_token).send({ team_id: 99 });

                    const expectedOutput = { status: "error", message: "Team does not exist" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not join a team that is not part of the event", async () => {
                    await request(server).post("/api/events/create").set("Authorization", access_token).send(event);
                    await request(server).post("/api/events/3/join_event").set("Authorization", access_token);
                    await request(server).post("/api/events/3/teams/create").set("Authorization", access_token).send(privateTeam);

                    const response = await request(server).post("/api/events/1/teams/join").set("Authorization", user2_access_token).send({ team_id: 3 });
                    const expectedOutput = { status: "error", message: "This team is not part of this event" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not join a private team if the password is wrong", async () => {
                    await request(server).post("/api/events/3/join_event").set("Authorization", user2_access_token);
                    const response = await request(server).post("/api/events/3/teams/join").set("Authorization", user2_access_token).send({ team_id: 3, password: "wrong_password" });

                    const expectedOutput = { status: "error", message: "Wrong Team Password" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                // test("Should not join a team if it has already exceeded the maximum allowed members", async () => { });

                test("Should join a private team with the correct password", async () => {
                    const response = await request(server).post("/api/events/3/teams/join").set("Authorization", user2_access_token).send({ team_id: 3, password: privateTeam.password });

                    expect(response.statusCode).toBe(200);
                    expect(response.body.status).toEqual("success");
                    expect(response.body.message).toEqual("Team joined successfully");
                });

                test("Should join a public team with no password required", async () => {
                    const response = await request(server).post("/api/events/1/teams/join").set("Authorization", user2_access_token).send({ team_id: 2 });

                    expect(response.statusCode).toBe(200);
                    expect(response.body.status).toEqual("success");
                    expect(response.body.message).toEqual("Team joined successfully");
                });
            });

            describe("Team Leave", () => {
                test("Should not leave a team if a leader", async () => {
                    const response = await request(server).post("/api/events/1/teams/leave").set("Authorization", user2_access_token);

                    const expectedOutput = { status: "error", message: "You are the leader can't leave the team but you can delete it" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });


                test("Should successfully leave a team", async () => {
                    const response = await request(server).post("/api/events/3/teams/leave").set("Authorization", user2_access_token);

                    expect(response.statusCode).toBe(200);
                    expect(response.body.status).toEqual("success");
                    expect(response.body.message).toEqual("Leaving successfuly");
                });

                test("Should not leave a team if not a member", async () => {
                    const response = await request(server).post("/api/events/3/teams/leave").set("Authorization", user2_access_token);

                    const expectedOutput = { status: "error", message: "You are not a member of a team" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });
            });
        });

        describe("Event Challenges", () => {
            describe("Challenge Creation", () => {
                test("Should not create challenge when missing parameters", async () => {
                    const response = await request(server).post("/api/events/1/challenges/create").set("Authorization", access_token);

                    const expectedOutput = {
                        status: 'error',
                        message: 'Invalid body parameters',
                        errors: [
                            "is_public is missing",
                            "level is missing",
                            "title is missing",
                            "description is missing",
                            "topic is missing",
                            "type is missing",
                        ]
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not create challenge when event does not exist", async () => {
                    const response = await request(server).post("/api/events/99/challenges/create").set("Authorization", access_token).send(challenge);

                    const expectedOutput = {
                        status: "error",
                        message: "Event does not exist"
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not create challenge without proper permissions", async () => {
                    const response = await request(server).post("/api/events/1/challenges/create").set("Authorization", user2_access_token).send(challenge);

                    const expectedOutput = {
                        status: "error",
                        message: "You don't have permissions"
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should create challenge successfully", async () => {
                    const response = await request(server).post("/api/events/1/challenges/create").set("Authorization", access_token).send(challenge);
                    // TODO: Get the Id from response
                    eventChallengesIds.push(2);

                    const expectedOutput = { status: "success", message: "Challenge created successfully" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });
            });

            describe("Challenge Update", () => {
                test("Should not update challenge when event does not exist", async () => {
                    const response = await request(server).post("/api/events/99/challenges/1/update").set("Authorization", access_token).send({ title: "New title" });

                    const expectedOutput = {
                        status: "error",
                        message: "Event not found"
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not update challenge when its not part of the event", async () => {
                    const response = await request(server).post("/api/events/1/challenges/99/update").set("Authorization", access_token).send({ title: "New title" });

                    const expectedOutput = {
                        status: "error",
                        message: "Challenge not found in this event"
                    };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should not update challenge without proper permissions", async () => {
                    const challengeId = eventChallengesIds.length > 0 ? eventChallengesIds[0] : 2;
                    const response = await request(server).post(`/api/events/1/challenges/${challengeId}/update`).set("Authorization", user2_access_token).send({ title: "New title" });

                    const expectedOutput = { status: "error", message: "You don't have permissions" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                });

                test("Should update challenge successfully", async () => {
                    const challengeId = eventChallengesIds.length > 0 ? eventChallengesIds[0] : 2;
                    const response = await request(server).post(`/api/events/1/challenges/${challengeId}/update`).set("Authorization", access_token).send({ title: "New title" });
                    const response1 = await request(server).get(`/api/challenges/${challengeId}`).set("Authorization", access_token);

                    const expectedOutput = { status: "success", message: "Challenge updated successfully" };

                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual(expectedOutput);
                    expect(response1.body.data.title).toEqual("New title");
                });
            });

            test("Should List event challenges", async () => {
                const response = await request(server).get("/api/events/1/challenges").set("Authorization", access_token);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(Array.isArray(response.body.data)).toBeTruthy();
            });
        });
    });

    describe("Public Challenges", () => {
        beforeAll(async () => {
            await request(server).post("/api/challenges/create").set("Authorization", access_token).send(privateChallenge);
            // TODO: Get the Id from response
            publicChallengesIds.push(3);
        });

        describe("Challenge Update", () => {
            test("Should not update challenge when its not part of the event", async () => {
                const response = await request(server).post("/api/challenges/99/update").set("Authorization", access_token).send({ title: "New title" });

                const expectedOutput = {
                    status: "error",
                    message: "Challenge not found"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should not update challenge without proper permissions", async () => {
                const response = await request(server).post("/api/challenges/2/update").set("Authorization", user2_access_token).send({ title: "New title" });

                const expectedOutput = { status: "error", message: "You don't have permissions" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should update challenge successfully", async () => {
                const response = await request(server).post("/api/challenges/2/update").set("Authorization", access_token).send({ title: "New title" });
                const response1 = await request(server).get("/api/challenges/2").set("Authorization", access_token);

                const expectedOutput = { status: "success", message: "Challenge updated successfully" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
                expect(response1.body.data.title).toEqual("New title");
            });
        });

        describe("Comment Creation", () => {
            test("Should return error for missing comment parameters", async () => {
                const response = await request(server).post("/api/challenges/1/comments/create").set("Authorization", access_token);

                const expectedOutput = {
                    status: 'error',
                    message: 'Comment is missing'
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should return error when challenge is not found", async () => {
                const response = await request(server).post("/api/challenges/99/comments/create").set("Authorization", access_token).send({ comment: "new comment" });

                const expectedOutput = {
                    status: 'error',
                    message: 'Challenge not found'
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should prevent commenting on private challenges", async () => {
                const response = await request(server).post("/api/challenges/3/comments/create").set("Authorization", access_token).send({ comment: "new comment" });

                const expectedOutput = {
                    status: "error",
                    message: "Can't comment on private challenges"
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should successfully create a comment", async () => {
                const response = await request(server).post("/api/challenges/1/comments/create").set("Authorization", access_token).send({ comment: "new comment" });

                const expectedOutput = {
                    status: 'success',
                    message: 'Comment posted successfully'
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });
        });

        describe("Comments fetch", () => {
            test("Should list all comments for a given challenge", async () => {
                const response = await request(server).get("/api/challenges/1/comments");

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(Array.isArray(response.body.data)).toBeTruthy();
            });

            test("Should return an error if the comment is not found", async () => {
                const response = await request(server).get("/api/challenges/1/comments/99");

                const expectedOutput = {
                    status: 'error',
                    message: 'Comment not found'
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should retrieve a specific comment by its id (1)", async () => {
                const response = await request(server).get("/api/challenges/1/comments/1");

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toEqual("success");
                expect(response.body.data.id).toEqual(1);
            });
        });

        describe("Comment Like", () => {
            test("Should return error when comment is not found", async () => {
                const response = await request(server).post("/api/challenges/1/comments/99/toggle_like").set("Authorization", access_token);

                const expectedOutput = {
                    status: 'error',
                    message: 'Comment not found'
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should successfully like a comment", async () => {
                const response = await request(server).post("/api/challenges/1/comments/1/toggle_like").set("Authorization", access_token);
                const response1 = await request(server).get("/api/challenges/1/comments/1").set("Authorization", access_token);

                const expectedOutput = { status: "success", message: "Liked the comment successfully" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
                expect(response1.body.data.likes).toEqual(1);
            });

            test("Should successfully unlike a comment", async () => {
                const response = await request(server).post("/api/challenges/1/comments/1/toggle_like").set("Authorization", access_token);
                const response1 = await request(server).get("/api/challenges/1/comments/1").set("Authorization", access_token);

                const expectedOutput = { status: "success", message: "Unliked the comment successfully" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
                expect(response1.body.data.likes).toEqual(0);
            });
        });

        describe("Comment Reply", () => {
            test("Should return error for missing comment parameters", async () => {
                const response = await request(server).post("/api/challenges/1/comments/1/reply").set("Authorization", access_token);

                const expectedOutput = {
                    status: 'error',
                    message: 'comment is missing'
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should return error when comment is not found", async () => {
                const response = await request(server).post("/api/challenges/1/comments/99/reply").set("Authorization", access_token).send({ comment: "new comment" });

                const expectedOutput = {
                    status: 'error',
                    message: 'Comment not found'
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should successfully reply to a comment", async () => {
                const response = await request(server).post("/api/challenges/1/comments/1/reply").set("Authorization", access_token).send({ comment: "new comment" });
                const response1 = await request(server).get("/api/challenges/1/comments/1").set("Authorization", access_token);

                const expectedOutput = {
                    status: 'success',
                    message: 'Reply to a comment successfully'
                };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
                expect(response1.body.data.replies).toEqual(1);
            });
        });
    });

    describe("Test Cases", () => {
        describe("Test Case Creation", () => {
            test("Should return error when invalid 'Create Test Cases' form data is submitted", async () => {
                const response = await request(server).post("/api/challenges/1/test_cases/create").set('Authorization', access_token);

                const expectedOutput = { status: "error", message: "TestCases is missing" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should return error if challenge not found", async () => {
                const response = await request(server).post("/api/challenges/99/test_cases/create").set('Authorization', access_token).send({ test_cases: testCases });

                const expectedOutput = { status: "error", message: "Challenge not found" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should not create test cases without proper permissions", async () => {
                const response = await request(server).post("/api/challenges/1/test_cases/create").set("Authorization", user2_access_token).send({ test_cases: testCases });

                const expectedOutput = { status: "error", message: "You don't have permissions" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
            });

            test("Should create test cases successfully", async () => {
                const response = await request(server).post("/api/challenges/1/test_cases/create").set("Authorization", access_token).send({ test_cases: testCases });
                const response1 = await request(server).get("/api/challenges/1/test_cases").set("Authorization", access_token);

                const expectedOutput = { status: "success", message: "Test Cases created successfully" };

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expectedOutput);
                expect(Array.isArray(response1.body.data)).toBeTruthy();
            });
        });

    });

    describe("Submissions", () => {
        test("Should list user submissions", async () => {
            const response = await request(server).get("/api/challenges/1/submissions").set('Authorization', access_token);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toEqual("success");
            expect(Array.isArray(response.body.data)).toBeTruthy();
        });
    });
});