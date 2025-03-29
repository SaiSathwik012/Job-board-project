import { MongoClient, ObjectId } from 'mongodb';

const validateJobData = (jobData) => {
    const requiredFields = [
        'jobTitle',
        'companyName',
        'description',
        'jobType',
        'salary',
        'location',
        'contactEmail'
    ];

    for (const field of requiredFields) {
        if (!jobData[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    if (!/^\S+@\S+\.\S+$/.test(jobData.contactEmail)) {
        throw new Error('Invalid email format');
    }

    if (jobData.contactPhone && !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(jobData.contactPhone)) {
        throw new Error('Invalid phone number format');
    }
};

export async function GET() {
    let client;
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const jobs = await db.collection('jobs')
            .find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .toArray();

        return Response.json({
            success: true,
            data: jobs.map(job => ({
                ...job,
                _id: job._id.toString()
            }))
        });

    } catch (error) {
        console.error('Error fetching jobs:', error);
        return Response.json(
            {
                success: false,
                message: error.message || 'Failed to fetch jobs'
            },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}

export async function POST(request) {
    let client;
    try {
        const jobData = await request.json();
        validateJobData(jobData);

        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const jobWithMetadata = {
            ...jobData,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            isFeatured: false
        };

        const result = await db.collection('jobs').insertOne(jobWithMetadata);
        const newJob = {
            ...jobWithMetadata,
            _id: result.insertedId.toString()
        };

        return Response.json({
            success: true,
            message: 'Job posted successfully and awaiting approval',
            data: newJob
        }, { status: 201 });

    } catch (error) {
        console.error('Error posting job:', error);
        return Response.json({
            success: false,
            message: error.message || 'Failed to post job'
        }, { status: 400 });
    } finally {
        if (client) {
            await client.close();
        }
    }
}