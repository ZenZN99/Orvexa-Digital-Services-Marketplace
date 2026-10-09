import { JobTitle, Skills } from '../../../common/enums/freelancer.enum.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { User } from '../../../modules/users/schema/user.schema.js';

const jobTitles = Object.values(JobTitle).filter(
  (title) => title !== JobTitle.NO_JOB_TITLE,
);

const skills = Object.values(Skills);

export const generateFreelancers = (createdUsers: User[]) => {
  const freelancers = createdUsers.filter(
    (user) => user.role === UserRole.FREELANCER,
  );

  return freelancers.map((user, index) => {
    const freelancerSkills = skills.filter(
      (_, skillIndex) =>
        skillIndex % 5 === index % 5 || skillIndex % 7 === index % 7,
    );

    return {
      userId: user.id,

      jobTitle: jobTitles[index % jobTitles.length] ?? JobTitle.NO_JOB_TITLE,

      about:
        'Professional freelancer with experience delivering high-quality work and reliable solutions to clients.',

      skills: freelancerSkills,

      website: index % 4 === 0 ? `https://portfolio-${index + 1}.com` : null,

      completedOrders: index % 50,

      ratingCount: index % 40,

      ratingAverage:
        index % 40 === 0 ? 0 : Number((3.5 + (index % 15) / 10).toFixed(2)),
    };
  });
};
