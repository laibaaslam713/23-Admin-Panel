require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Message = require('./models/Message');
const connectDB = require('./config/db');

const seedData = async () => {
  await connectDB();

  await Admin.deleteMany({});
  await Message.deleteMany({});

  const admins = await Admin.create([
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'superadmin',
    },
    {
      username: 'manager',
      email: 'manager@example.com',
      password: 'Manager@123',
      role: 'admin',
    },
  ]);

  console.log('✅ Admin accounts created:');
  admins.forEach(a => console.log(`   - ${a.email} (${a.role})`));

  const sampleMessages = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      subject: 'Product Inquiry',
      message: 'Hello, I would like to know more about your enterprise pricing plans and available features.',
      isRead: true,
      readAt: new Date(),
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      subject: 'Technical Support',
      message: 'I am facing issues with the API integration. The authentication endpoint keeps returning 401 errors even with valid credentials.',
      isRead: false,
    },
    {
      name: 'Carol Davis',
      email: 'carol@example.com',
      subject: 'Partnership Proposal',
      message: 'We are interested in exploring partnership opportunities with your company. Our platform serves over 10,000 businesses globally.',
      isRead: false,
    },
    {
      name: 'David Wilson',
      email: 'david@example.com',
      subject: 'Feature Request',
      message: 'It would be great if you could add dark mode to the dashboard. Many of our team members work late hours and this would reduce eye strain.',
      isRead: true,
      readAt: new Date(Date.now() - 86400000),
    },
    {
      name: 'Emma Brown',
      email: 'emma@example.com',
      subject: 'Bug Report',
      message: 'Found a bug on the checkout page. When using Safari on iOS, the payment form does not submit properly. Steps to reproduce: 1. Add item to cart. 2. Proceed to checkout. 3. Fill payment details. 4. Submit.',
      isRead: false,
    },
    {
      name: 'Frank Miller',
      email: 'frank@example.com',
      subject: 'General Inquiry',
      message: 'What are your office hours and what is the best way to reach your sales team for a quick demo call?',
      isRead: true,
      readAt: new Date(Date.now() - 172800000),
    },
    {
      name: 'Grace Lee',
      email: 'grace@example.com',
      subject: 'Billing Question',
      message: 'I was charged twice for my subscription this month. Could you please look into this and process a refund for the duplicate charge?',
      isRead: false,
    },
    {
      name: 'Henry Taylor',
      email: 'henry@example.com',
      subject: 'Testimonial Submission',
      message: 'Your platform has completely transformed how our team manages projects. We have increased productivity by 40% since switching to your service!',
      isRead: true,
      readAt: new Date(Date.now() - 259200000),
    },
  ];

  const messages = await Promise.all(
    sampleMessages.map((msg, i) => {
      const m = new Message(msg);
      m.createdAt = new Date(Date.now() - i * 3600000 * 12);
      return m.save();
    })
  );

  console.log(`✅ ${messages.length} sample messages created`);
  console.log('\n🔑 Login credentials:');
  console.log('   Email: admin@example.com | Password: Admin@123 (superadmin)');
  console.log('   Email: manager@example.com | Password: Manager@123 (admin)');
  
  await mongoose.disconnect();
  console.log('\n✅ Seeding complete!');
  process.exit(0);
};

seedData().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
