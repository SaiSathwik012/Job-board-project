import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

// Singleton MongoDB Connection
let client;
async function connectDB() {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
    }
    return client.db();
}

// Validate job data
const validateJobData = (jobData) => {
    const requiredFields = [
        'jobTitle', 'companyName', 'description', 'jobType',
        'salary', 'location', 'contactEmail'
    ];

    for (const field of requiredFields) {
        if (!jobData[field]) throw new Error(`Missing required field: ${field}`);
    }

    if (!/^\S+@\S+\.\S+$/.test(jobData.contactEmail)) {
        throw new Error('Invalid email format');
    }

    if (jobData.contactPhone && !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(jobData.contactPhone)) {
        throw new Error('Invalid phone number format');
    }
};

// GET jobs
export async function GET() {
    try {
        const db = await connectDB();
        const jobs = await db.collection('jobs')
            .find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: jobs.map(job => ({
                ...job,
                _id: job._id.toString()
            }))
        });

    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST job
export async function POST(request) {
    try {
        const jobData = await request.json();
        validateJobData(jobData);

        const db = await connectDB();
        const jobWithMetadata = {
            ...jobData,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            isFeatured: false
        };

        const result = await db.collection('jobs').insertOne(jobWithMetadata);
        return NextResponse.json({
            success: true,
            message: 'Job posted successfully and awaiting approval',
            data: { ...jobWithMetadata, _id: result.insertedId.toString() }
        }, { status: 201 });

    } catch (error) {
        console.error('Error posting job:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
