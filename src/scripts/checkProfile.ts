import dotenv from 'dotenv';
import connectDB from '../mongodbConfig';
import UserProfile from '../userProfiles/userProfile.model';

dotenv.config();

async function checkProfile() {
  try {
    await connectDB();
    
    const userId = '68a62712f3d2d2edbe57d688';
    console.log('🔍 Looking for profile with userRefId:', userId);
    
    const profile = await UserProfile.findOne({ userRefId: userId });
    
    if (profile) {
      console.log('\n✅ Profile Found:');
      console.log('Profile ID (_id):', profile._id.toString());
      console.log('User Ref ID (userRefId):', profile.userRefId.toString());
      console.log('\n📝 Use this for updates:');
      console.log('By Profile ID: PUT /api/userProfiles/' + profile._id.toString());
      console.log('By User Ref ID: PUT /api/userProfiles/user/' + profile.userRefId.toString());
    } else {
      console.log('❌ No profile found for this user');
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkProfile();

